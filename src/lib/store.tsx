"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";

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
  addProject: (p: Project) => void;
  removeProject: (id: string) => void;
  addTask: (projectId: string, task: Task) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Quantum Neural Network",
    description: "Next-gen AI infrastructure for distributed computing environments.",
    status: "active",
    lead: "Sarah Jenkins",
    dueDate: "2026-05-05",
    progress: 72,
    members: ["Sarah Jenkins", "David Chen", "Elena Rodriguez"],
    tasks: [
      { id: "t1", title: "Design neural layer architecture", description: "", status: "done",        priority: "high",     assignee: "Sarah Jenkins",   startDate: "2026-04-10", dueDate: "2026-04-20", tags: ["architecture"] },
      { id: "t2", title: "Implement data pipeline",          description: "", status: "in_progress", priority: "high",     assignee: "David Chen",      startDate: "2026-04-18", dueDate: "2026-04-28", tags: ["backend"]      },
      { id: "t3", title: "Write unit tests for core module", description: "", status: "todo",        priority: "medium",   assignee: "Elena Rodriguez", startDate: "2026-04-25", dueDate: "2026-05-02", tags: ["testing"]      },
      { id: "t4", title: "Performance benchmarking",         description: "", status: "review",      priority: "critical", assignee: "Sarah Jenkins",   startDate: "2026-04-28", dueDate: "2026-05-04", tags: ["performance"]  },
    ],
  },
  {
    id: "2",
    name: "Global Logistics Refactor",
    description: "Overhaul the legacy logistics system with a modern microservices approach.",
    status: "active",
    lead: "Mike Ross",
    dueDate: "2026-04-27",
    progress: 45,
    members: ["Mike Ross", "Anya Patel"],
    tasks: [
      { id: "t5", title: "Audit current codebase",           description: "", status: "done",        priority: "high",   assignee: "Mike Ross",  startDate: "2026-04-01", dueDate: "2026-04-15", tags: ["audit"]        },
      { id: "t6", title: "Define microservices boundaries",   description: "", status: "in_progress", priority: "high",   assignee: "Anya Patel", startDate: "2026-04-14", dueDate: "2026-04-25", tags: ["architecture"] },
      { id: "t7", title: "API gateway setup",                 description: "", status: "todo",        priority: "medium", assignee: "Mike Ross",  startDate: "2026-04-24", dueDate: "2026-04-27", tags: ["backend"]      },
    ],
  },
  {
    id: "3",
    name: "Secure Edge Computing",
    description: "Deploy secure edge nodes for real-time data processing at the network periphery.",
    status: "active",
    lead: "Elena Rodriguez",
    dueDate: "2026-05-21",
    progress: 28,
    members: ["Elena Rodriguez", "James Liu", "Sarah Jenkins"],
    tasks: [
      { id: "t8", title: "Security threat modelling",         description: "", status: "in_progress", priority: "critical", assignee: "Elena Rodriguez", startDate: "2026-04-20", dueDate: "2026-05-01", tags: ["security"] },
      { id: "t9", title: "Edge node provisioning scripts",    description: "", status: "todo",         priority: "high",     assignee: "James Liu",       startDate: "2026-05-01", dueDate: "2026-05-10", tags: ["infra"]    },
    ],
  },
];

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
  const [projects, setProjects]               = useState<Project[]>(initialProjects);
  const teamMembers = initialTeamMembers;

  useEffect(() => {
    const storedAuth = localStorage.getItem("cybercore_auth");
    if (storedAuth === "true") setIsAuthenticated(true);
    setIsInitialized(true);
  }, []);

  const handleSetAuthenticated = (v: boolean) => {
    setIsAuthenticated(v);
    v
      ? localStorage.setItem("cybercore_auth", "true")
      : localStorage.removeItem("cybercore_auth");
  };

  const addProject    = (p: Project) => setProjects((prev) => [...prev, p]);
  const removeProject = (id: string) => setProjects((prev) => prev.filter((p) => p.id !== id));

  const addTask = (projectId: string, task: Task) =>
    setProjects((prev) =>
      prev.map((p) => p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p)
    );

  const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.map((t) => t.id === taskId ? { ...t, status } : t) }
          : p
      )
    );

  return (
    <AppContext.Provider value={{
      isAuthenticated, isInitialized,
      currentUser: "Admin User",
      projects, teamMembers,
      setAuthenticated: handleSetAuthenticated,
      addProject, removeProject, addTask, updateTaskStatus,
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