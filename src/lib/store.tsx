"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { api, clearToken, getToken, setToken } from "@/lib/api/client";
import {
  mapCreateProjectBody,
  mapCreateTaskBody,
  mapProjectFromApi,
  mapTaskFromApi,
} from "@/lib/api/mappers";

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  startDate: string;
  dueDate: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "on_hold" | "completed";
  lead: string;
  dueDate: string;
  progress: number;
  tasks: Task[];
  members: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  status: "active" | "away" | "offline";
  activeTasks: number;
}

interface AppState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  currentUser: string;
  projects: Project[];
  teamMembers: TeamMember[];
  setAuthenticated: (v: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProjects: () => Promise<void>;
  addProject: (data: {
    name: string;
    description: string;
    lead: string;
    dueDate: string;
    status: Project["status"];
    members: string[];
  }) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  addTask: (
    projectId: string,
    data: {
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      assignee: string;
      dueDate: string;
    },
  ) => Promise<void>;
  updateTaskStatus: (
    projectId: string,
    taskId: string,
    status: TaskStatus,
  ) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
}

const initialTeamMembers: TeamMember[] = [
  { id: "m1", name: "Sarah Jenkins", role: "Lead Engineer", email: "s.jenkins@cyber.io", department: "Engineering", status: "active", activeTasks: 0 },
  { id: "m2", name: "David Chen", role: "Backend Developer", email: "d.chen@cyber.io", department: "Engineering", status: "active", activeTasks: 0 },
  { id: "m3", name: "Elena Rodriguez", role: "Security Architect", email: "e.rodriguez@cyber.io", department: "Security", status: "away", activeTasks: 0 },
  { id: "m4", name: "Mike Ross", role: "Systems Lead", email: "m.ross@cyber.io", department: "Infrastructure", status: "active", activeTasks: 0 },
  { id: "m5", name: "Anya Patel", role: "API Engineer", email: "a.patel@cyber.io", department: "Engineering", status: "active", activeTasks: 0 },
  { id: "m6", name: "James Liu", role: "DevOps Engineer", email: "j.liu@cyber.io", department: "Infrastructure", status: "offline", activeTasks: 0 },
];

const AppContext = createContext<AppState | undefined>(undefined);

async function loadProjectsWithTasks(): Promise<Project[]> {
  const apiProjects = await api.listProjects();
  const allTasks = await api.listTasks();

  const tasksByProject = allTasks.reduce<Record<string, Task[]>>((acc, t) => {
    const pid = t.project_id ?? "";
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(mapTaskFromApi(t));
    return acc;
  }, {});

  return apiProjects.map((p) =>
    mapProjectFromApi(p, tasksByProject[p.id] ?? []),
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState("Admin User");
  const teamMembers = initialTeamMembers;

  const refreshProjects = useCallback(async () => {
    const data = await loadProjectsWithTasks();
    setProjects(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      const storedAuth = localStorage.getItem("cybercore_auth");
      const token = getToken();

      if (storedAuth === "true" && token) {
        setIsAuthenticated(true);
        try {
          await refreshProjects();
        } catch {
          clearToken();
          localStorage.removeItem("cybercore_auth");
          setIsAuthenticated(false);
        }
      }
      setIsInitialized(true);
    };
    init();
  }, [refreshProjects]);

  const handleSetAuthenticated = (v: boolean) => {
    setIsAuthenticated(v);
    if (v) {
      localStorage.setItem("cybercore_auth", "true");
    } else {
      localStorage.removeItem("cybercore_auth");
      clearToken();
      setProjects([]);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setToken(res.access_token);
    setCurrentUser(email.split("@")[0] ?? "User");
    handleSetAuthenticated(true);
    await refreshProjects();
  };

  const logout = () => handleSetAuthenticated(false);

  const addProject = async (data: {
    name: string;
    description: string;
    lead: string;
    dueDate: string;
    status: Project["status"];
    members: string[];
  }) => {
    setIsLoading(true);
    try {
      const body = mapCreateProjectBody({
        name: data.name,
        description: data.description,
        lead: data.lead,
        dueDate: data.dueDate,
        members: data.members.length ? data.members : [data.lead],
      });
      await api.createProject(body);
      await refreshProjects();
    } finally {
      setIsLoading(false);
    }
  };

  const removeProject = async (id: string) => {
    await api.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addTask = async (
    projectId: string,
    data: {
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      assignee: string;
      dueDate: string;
    },
  ) => {
    const body = mapCreateTaskBody(data);
    const created = await api.createTask(projectId, body);
    const task = mapTaskFromApi(created);

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p,
      ),
    );
  };

  const updateTaskStatus = async (
    projectId: string,
    taskId: string,
    status: TaskStatus,
  ) => {
    const prevProjects = projects;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, status } : t,
              ),
            }
          : p,
      ),
    );

    try {
      const updated = await api.updateTaskStatus(taskId, status);
      const mapped = mapTaskFromApi(updated);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                tasks: p.tasks.map((t) => (t.id === taskId ? mapped : t)),
              }
            : p,
        ),
      );
    } catch {
      setProjects(prevProjects);
      throw new Error("Não foi possível actualizar o status da tarefa.");
    }
  };

  const deleteTask = async (projectId: string, taskId: string) => {
    await api.deleteTask(taskId);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
          : p,
      ),
    );
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        isLoading,
        currentUser,
        projects,
        teamMembers,
        setAuthenticated: handleSetAuthenticated,
        login,
        logout,
        refreshProjects,
        addProject,
        removeProject,
        addTask,
        updateTaskStatus,
        deleteTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
}
