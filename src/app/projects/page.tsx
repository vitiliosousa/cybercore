"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore, Project } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ProjectHeader } from "./components/ProjectHeader";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectModal } from "./components/ProjectModal";
import { ProjectEmptyState } from "./components/ProjectEmptyState";

type ProjectWithDays = Project & { diasRestantes: number };

export default function ProjectsPage() {
  const { isAuthenticated, isInitialized, projects = [] } = useAppStore();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "active" | "on_hold" | "completed"
  >("all");
  const [isMounted, setIsMounted] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isInitialized && !isAuthenticated) router.push("/login");
  }, [isInitialized, isAuthenticated, router]);

  const filtrados = useMemo(() => {
    return projects.filter((p) => {
      const coincideBusca = p.name.toLowerCase().includes(search.toLowerCase());
      const coincideFiltro = filter === "all" || p.status === filter;
      return coincideBusca && coincideFiltro;
    });
  }, [projects, search, filter]);

  const projectosComDias: ProjectWithDays[] = useMemo(() => {
    if (!isMounted) return [];
    const now = Date.now();
    return filtrados.map((p) => ({
      ...p,
      diasRestantes: Math.ceil(
        (new Date(p.dueDate).getTime() - now) / 86400000,
      ),
    }));
  }, [isMounted, filtrados]);

  if (!isInitialized || !isAuthenticated || !isMounted) return null;

  return (
    <AppLayout>
      {modalAberto && (
        <ProjectModal
          onClose={() => setModalAberto(false)}
          onSuccess={() => setModalAberto(false)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <ProjectHeader
          count={filtrados.length}
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
          onNewProject={() => setModalAberto(true)}
        />

        {projectosComDias.length === 0 ? (
          <ProjectEmptyState
            search={search}
            onClearSearch={() => setSearch("")}
            onNewProject={() => setModalAberto(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {projectosComDias.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
