"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore, Project } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StatsCards } from "./components/StatsCards";
import { ProjectsOverview } from "./components/ProjectsOverview";
import { RecentActivity } from "./components/RecentActivity";

interface DashboardStats {
  tarefasPendentes: number;
  projectosActivos: number;
  prazosProximos: number;
  projectosComDias: (Project & { diasRestantes: number })[];
}

export default function DashboardPage() {
  const { isAuthenticated, isInitialized, projects = [] } = useAppStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (isInitialized && !isAuthenticated) router.push("/login");
  }, [isInitialized, isAuthenticated, router]);

  useEffect(() => {
    if (!isMounted) return;

    const now = Date.now();
    const todasAsTarefas = projects.flatMap((p) => p.tasks);
    const tarefasPendentes = todasAsTarefas.filter(
      (t) => t.status !== "done",
    ).length;
    const projectosActivos = projects.filter(
      (p) => p.status === "active",
    ).length;
    const prazosProximos = projects.filter((p) => {
      const dias = Math.ceil((new Date(p.dueDate).getTime() - now) / 86400000);
      return dias >= 0 && dias <= 14;
    }).length;

    const projectosComDias = projects.map((p) => ({
      ...p,
      diasRestantes: Math.ceil(
        (new Date(p.dueDate).getTime() - now) / 86400000,
      ),
    }));

    setStats({
      tarefasPendentes,
      projectosActivos,
      prazosProximos,
      projectosComDias,
    });
  }, [isMounted, projects]);

  if (!isInitialized || !isAuthenticated || !isMounted || !stats) return null;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                Dashboard
              </h1>
            </div>
            <p className="text-text-muted text-xs">
              Monitorização em tempo real da eficiência operacional em{" "}
              <span className="font-semibold text-accent">
                {stats.projectosActivos} iniciativas activas
              </span>
              .
            </p>
          </div>
        </div>
        <StatsCards stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ProjectsOverview projects={stats.projectosComDias} />
          <RecentActivity />
        </div>
      </div>
    </AppLayout>
  );
}
