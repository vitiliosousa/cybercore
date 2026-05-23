"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore, Project } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ProjectHeader } from "./components/ProjectHeader";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectModal } from "./components/ProjectModal";
import { ProjectEmptyState } from "./components/ProjectEmptyState";
import { DeleteProjectModal } from "./components/DeleteProjectModal";

type ProjectWithDays = Project & { diasRestantes: number };

export default function ProjectsPage() {
  const { isAuthenticated, isInitialized, projects = [], removeProject } = useAppStore();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "active" | "on_hold" | "completed"
  >("all");
  const [isMounted, setIsMounted] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(undefined);
  const [projectToDelete, setProjectToDelete] = useState<Project | undefined>(undefined);

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
    
    // Normalizar "hoje" para o início do dia
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const hojeTime = hoje.getTime();

    return filtrados.map((p) => {
      // Normalizar data limite para o início do dia
      const dataLimite = new Date(p.rawDueDate);
      dataLimite.setHours(0, 0, 0, 0);
      const dataLimiteTime = dataLimite.getTime();

      const diffTime = dataLimiteTime - hojeTime;
      const diasRestantes = Math.round(diffTime / 86400000);

      return {
        ...p,
        diasRestantes,
      };
    });
  }, [isMounted, filtrados]);

  const handleEdit = (p: Project) => {
    setProjectToEdit(p);
    setModalAberto(true);
  };

  const handleDelete = (p: Project) => {
    setProjectToDelete(p);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      await removeProject(projectToDelete.id);
      setProjectToDelete(undefined);
    }
  };

  if (!isInitialized || !isAuthenticated || !isMounted) return null;

  return (
    <AppLayout>
      {modalAberto && (
        <ProjectModal
          project={projectToEdit}
          onClose={() => {
            setModalAberto(false);
            setProjectToEdit(undefined);
          }}
          onSuccess={() => {
            setModalAberto(false);
            setProjectToEdit(undefined);
          }}
        />
      )}

      {projectToDelete && (
        <DeleteProjectModal
          project={projectToDelete}
          onClose={() => setProjectToDelete(undefined)}
          onConfirm={confirmDelete}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <ProjectHeader
          count={filtrados.length}
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
          onNewProject={() => {
            setProjectToEdit(undefined);
            setModalAberto(true);
          }}
        />

        {projectosComDias.length === 0 ? (
          <ProjectEmptyState
            search={search}
            onClearSearch={() => setSearch("")}
            onNewProject={() => {
              setProjectToEdit(undefined);
              setModalAberto(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {projectosComDias.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={() => handleEdit(project)}
                onDelete={() => handleDelete(project)}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
