"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ProfileUserCard } from "./components/ProfileUserCard";
import { ProfileTasksList } from "./components/ProfileTasksList";
import { ProfileProjectsList } from "./components/ProfileProjectsList";

// ─── Mapas de estilo ───────────────────────────────────────────────────────────
const statusDot: Record<string, string> = {
  active:  "#d3f000",
  away:    "#f59e0b",
  offline: "#333333",
};

const statusLabel: Record<string, string> = {
  active:  "Activo",
  away:    "Ausente",
  offline: "Offline",
};

const statusStyle: Record<string, { color: string; bg: string }> = {
  active:  { color: "#d3f000", bg: "rgba(211,240,0,0.1)"  },
  away:    { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  offline: { color: "#555555", bg: "rgba(85,85,85,0.1)"   },
};

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const { isAuthenticated, isInitialized, projects, currentUser } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) router.push("/login");
  }, [isInitialized, isAuthenticated, router]);

  // Utilizador autenticado — usando o primeiro membro como mock do utilizador logado
  // const user = useMemo(() => teamMembers[0], [teamMembers]);

  const userTasks = useMemo(() => {
    if (!currentUser) return [];
    return projects.flatMap((p) =>
      p.tasks
        .filter((t) => t.assignee === currentUser.name)
        .map((t) => ({ ...t, projectName: p.name, projectId: p.id }))
    );
  }, [currentUser, projects]);

  const userProjects = useMemo(() => {
    if (!currentUser) return [];
    return projects.filter((p) => p.members.includes(currentUser.name));
  }, [currentUser, projects]);

  const stats = useMemo(() => {
    const total = userTasks.length;
    const done = userTasks.filter((t) => t.status === "done").length;
    const pending = total - done;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pending, percentage };
  }, [userTasks]);

  // build a TeamMember-shaped object from the token payload
  const user = useMemo(() => {
    if(!currentUser) return null;
    return {
      id: currentUser.sub,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      department: "",
      status: "active" as const,
      activeTasks: userTasks.filter((t) => t.status !== "done").length
    };
  }, [currentUser, userTasks]);

  if (!isInitialized || !isAuthenticated || !user) return null;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <ProfileUserCard
          user={user}
          initials={getInitials(user.name)}
          statusLabel={statusLabel[user.status]}
          statusStyle={statusStyle[user.status]}
          statusDot={statusDot[user.status]}
          stats={{
            tasksCount: stats.total,
            projectsCount: userProjects.length,
            completionPercentage: stats.percentage,
            tasksDone: stats.done,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ProfileTasksList 
            tasks={userTasks} 
            stats={{ pending: stats.pending, done: stats.done }} 
          />
          <ProfileProjectsList 
            projects={userProjects} 
            userName={user.name} 
          />
        </div>
      </div>
    </AppLayout>
  );
}
