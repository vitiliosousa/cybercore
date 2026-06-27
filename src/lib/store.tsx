"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { fetchProjects, createProject, updateProject, updateProjectStatus, deleteProject, mapApiProjectToFrontend, CreateProjectRequest, UpdateStatusRequest as ProjectUpdateStatusRequest } from "@/api/projects/fetches";
import { fetchTasks, createTask, updateTask, updateTaskStatus, mapApiTaskToFrontend, CreateTaskRequest, UpdateStatusRequest } from "@/api/tasks/fetches";

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low_priority" | "medium_priority" | "high_priority" | "critical_priority";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  startDate: string; // ← ADICIONADO
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
  rawDueDate: string; // ISO format for calculations
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
  currentUser: string;
  projects: Project[];
  teamMembers: TeamMember[];
  setAuthenticated: (v: boolean) => void;
  addProject: (body: CreateProjectRequest) => void;
  editProject: (id: string, body: CreateProjectRequest) => void;
  editProjectStatus: (id: string, body: ProjectUpdateStatusRequest) => void;
  removeProject: (id: string) => void;
  addTask: (projectId: string, body: CreateTaskRequest) => void;
  editTaskStatus: (projectId: string, taskId: string, body: UpdateStatusRequest) => void;
}

const initialTeamMembers: TeamMember[] = [
  { id: "m1", name: "Sarah Jenkins",   role: "Lead Engineer",     email: "s.jenkins@cyber.io",   department: "Engineering",     status: "active",  activeTasks: 4 },
  { id: "m2", name: "David Chen",      role: "Backend Developer", email: "d.chen@cyber.io",      department: "Engineering",     status: "active",  activeTasks: 3 },
  { id: "m3", name: "Elena Rodriguez", role: "Security Architect", email: "e.rodriguez@cyber.io", department: "Security",        status: "away",    activeTasks: 2 },
  { id: "m4", name: "Mike Ross",       role: "Systems Lead",      email: "m.ross@cyber.io",      department: "Infrastructure",  status: "active",  activeTasks: 2 },
  { id: "m5", name: "Anya Patel",      role: "API Engineer",      email: "a.patel@cyber.io",     department: "Engineering",     status: "active",  activeTasks: 1 },
  { id: "m6", name: "James Liu",       role: "DevOps Engineer",   email: "j.liu@cyber.io",       department: "Infrastructure",  status: "offline", activeTasks: 1 },
];

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized]     = useState(false);
  const [projects, setProjects]               = useState<Project[]>([]);
  const teamMembers = initialTeamMembers;

  useEffect(() => {
    const storedAuth = localStorage.getItem("cybercore_auth");
    if (storedAuth === "true") setIsAuthenticated(true);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      const allProjects = await fetchProjects();
      if (!allProjects) return;

      const projectsWithTasks = await Promise.all(
        allProjects.map(async (apiProject) => {
          const apiTasks = await fetchTasks({project_id: apiProject.id});
          const tasks = apiTasks ? apiTasks.map(mapApiTaskToFrontend) : [];
          return { ...mapApiProjectToFrontend(apiProject), tasks};
        })
      );

      setProjects(projectsWithTasks)
    };
    loadProjects();
  }, []);

  const handleSetAuthenticated = (v: boolean) => {
    setIsAuthenticated(v);
    v
      ? localStorage.setItem("cybercore_auth", "true")
      : localStorage.removeItem("cybercore_auth");
  };

  const addProject = async (body: CreateProjectRequest): Promise<void> => {
    const created = await createProject(body);
    if (created) setProjects((prev) => [...prev, { ...created, tasks: [] }]);
  }; 

  const editProject = async (id: string, body: CreateProjectRequest): Promise<void> => {
    const updated = await updateProject(id, body);
    if (updated) {
      setProjects((prev) => 
        prev.map((p) => (p.id === id ? { ...updated, tasks: p.tasks } : p))
      );
    }
  };

  const editProjectStatus = async (id: string, body: ProjectUpdateStatusRequest): Promise<void> => {
    const updated = await updateProjectStatus(id, body);
    if (updated) {
      setProjects((prev) => 
        prev.map((p) => (p.id === id ? { ...updated, tasks: p.tasks } : p))
      );
    }
  };

  const removeProject = async (id: string) => {
    const success = await deleteProject(id);
    if (success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const addTask = async (projectId: string, body: CreateTaskRequest): Promise<void> => {
    const created = await createTask(projectId, body);
    if(created) 
      setProjects((prev) =>
        prev.map((p) => p.id === projectId ? { ...p, tasks: [...p.tasks, created]} : p)
      );
  };

  // const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus) =>
  //   setProjects((prev) =>
  //     prev.map((p) =>
  //       p.id === projectId
  //         ? { ...p, tasks: p.tasks.map((t) => t.id === taskId ? { ...t, status } : t) }
  //         : p
  //     )
  //   );
  // const editTaskStatus = async (projectId: string, taskId: string, body: UpdateStatusRequest): Promise<void> =>{
  //   const updated = await updateTaskStatus(taskId, body);
  //   if(updated)
  //     setProjects((prev) =>
  //       prev.map((p) =>
  //         p.id === projectId
  //           ? { ...p, tasks: p.tasks.map((t) => t.id === taskId ? updated : t)}
  //           : p
  //       )
  //     );
  // };
  const editTaskStatus = async (projectId: string, taskId: string, body: UpdateStatusRequest): Promise<void> => {
  // 1. optimistic update — update UI immediately
  setProjects((prev) =>
    prev.map((p) =>
      p.id === projectId
        ? { ...p, tasks: p.tasks.map((t) => t.id === taskId ? { ...t, status: body.status as TaskStatus } : t) }
        : p
    )
  );

  // 2. call API
  const updated = await updateTaskStatus(taskId, body);

  // 3. rollback on failure, or sync with real API response on success
  if (updated) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.map((t) => t.id === taskId ? updated : t) }
          : p
      )
    );
  } else {
    // rollback — re-fetch the project tasks to restore real state
    const apiTasks = await fetchTasks({ project_id: projectId });
    if (apiTasks) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, tasks: apiTasks.map(mapApiTaskToFrontend) }
            : p
        )
      );
    }
  }
};

  return (
    <AppContext.Provider value={{
      isAuthenticated, isInitialized,
      currentUser: "Admin User",
      projects, teamMembers,
      setAuthenticated: handleSetAuthenticated,
      addProject, editProject, editProjectStatus, removeProject, addTask, editTaskStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
}