"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";
import { Project } from "@/lib/store";
import { ProjectContextMenu } from "./ProjectContextMenu";

const statusLabel: Record<string, string> = {
  active: "ACTIVO",
  on_hold: "EM PAUSA",
  completed: "CONCLUÍDO",
};

const statusStyle: Record<string, { color: string; bg: string }> = {
  active: { color: "#d3f000", bg: "rgba(211,240,0,0.1)" },
  on_hold: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  completed: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
};

interface ProjectCardProps {
  project: Project & { diasRestantes: number };
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null!);

  const { diasRestantes } = project;
  const s = statusStyle[project.status];

  return (
    <div
      className="rounded-xl border flex flex-col gap-4 p-5 cursor-pointer transition-all duration-200 group relative bg-bg-card border-border hover:border-accent hover:bg-bg-card-hover"
      onClick={() => router.push(`/projects/${project.id}/kanban`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span
            className="inline-block text-[9px] font-black tracking-[0.15em] px-2 py-0.5 rounded-sm mb-2 uppercase"
            style={{ color: s.color, backgroundColor: s.bg }}
          >
            {statusLabel[project.status]}
          </span>
          <h3 className="text-[14px] font-bold text-white leading-snug truncate">
            {project.name}
          </h3>
          <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>

        <div className="relative">
          <button
            ref={menuBtnRef}
            onClick={(e) => {
              e.stopPropagation();
              setMenuAberto(!menuAberto);
            }}
            className="p-1.5 rounded-md transition-colors shrink-0"
            style={{
              backgroundColor: menuAberto ? "#d3f000" : "transparent",
              color: menuAberto ? "#000" : "#555555",
            }}
          >
            <MoreHorizontal size={14} />
          </button>

          {menuAberto && (
            <ProjectContextMenu
              project={project}
              onClose={() => setMenuAberto(false)}
              anchorRef={menuBtnRef}
            />
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-[10px] text-text-muted mb-1.5">
          <span className="uppercase tracking-wider">Progresso</span>
          <span className="font-black text-white">{project.progress}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden bg-border">
          <div
            className="h-full rounded-full transition-all bg-accent"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div
        className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t"
        style={{ borderColor: "#2a2a2a" }}
      >
        <span>
          Responsável:{" "}
          <span className="text-text-secondary font-medium">
            {project.lead}
          </span>
        </span>
        <span
          suppressHydrationWarning
          style={{ color: diasRestantes < 0 ? "#ef4444" : "#555555" }}
        >
          {diasRestantes >= 0
            ? `${diasRestantes} dias restantes`
            : `${Math.abs(diasRestantes)} dias em atraso`}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {project.members.length === 0 && (
            <span className="text-[10px] text-text-muted">Sem equipa</span>
          )}
          {project.members.slice(0, 3).map((m, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-black text-black bg-accent border-bg-card"
              title={m}
            >
              {m.charAt(0)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
