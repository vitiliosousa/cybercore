"use client";

import { Folder } from "lucide-react";
import { Project } from "@/lib/store";
import { useRouter } from "next/navigation";

interface ProfileProjectsListProps {
  projects: Project[];
  userName: string;
}

export function ProfileProjectsList({ projects, userName }: ProfileProjectsListProps) {
  const router = useRouter();

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
    >
      <div
        className="flex items-center gap-2 px-5 py-3 border-b"
        style={{ borderColor: "#2a2a2a", backgroundColor: "#111" }}
      >
        <Folder size={13} style={{ color: "#d3f000" }} />
        <h2 className="text-[11px] font-black text-white uppercase tracking-widest">
          Projectos
        </h2>
      </div>

      <div className="divide-y" style={{ borderColor: "#222" }}>
        {projects.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[12px] text-text-muted">Sem projectos associados.</p>
          </div>
        ) : (
          projects.map((project) => {
            const tarefasDoUserNoProjecto = project.tasks.filter(
              (t) => t.assignee === userName
            ).length;

            return (
              <div
                key={project.id}
                className="px-5 py-3.5 hover:bg-border-light transition-colors cursor-pointer group"
                onClick={() => router.push(`/projects/${project.id}/kanban`)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-[13px] font-semibold text-white group-hover:text-accent transition-colors truncate">
                    {project.name}
                  </p>
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase shrink-0"
                    style={{
                      color: project.status === "active" ? "#d3f000"
                        : project.status === "on_hold" ? "#f59e0b"
                        : "#3b82f6",
                      backgroundColor: project.status === "active" ? "rgba(211,240,0,0.1)"
                        : project.status === "on_hold" ? "rgba(245,158,11,0.1)"
                        : "rgba(59,130,246,0.1)",
                    }}
                  >
                    {project.status === "active" ? "Activo"
                      : project.status === "on_hold" ? "Em Pausa"
                      : "Concluído"}
                  </span>
                </div>

                {/* Progresso do projecto */}
                <div className="mb-2">
                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${project.progress}%`, backgroundColor: "#d3f000" }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted">
                    {tarefasDoUserNoProjecto} {tarefasDoUserNoProjecto === 1 ? "tarefa" : "tarefas"} suas
                  </span>
                  <span className="text-[10px] font-black text-white">{project.progress}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
