"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Edit3, Copy, Trash2 } from "lucide-react";
import { Project } from "@/lib/store";

interface ProjectContextMenuProps {
  project: Project;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}

export const ProjectContextMenu = ({ project, onClose, anchorRef }: ProjectContextMenuProps) => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  const acoes = [
    {
      label: "Abrir Projecto",
      icon: ArrowUpRight,
      action: () => { router.push(`/projects/${project.id}/kanban`); onClose(); },
    },
    {
      label: "Editar Projecto",
      icon: Edit3,
      action: () => { router.push(`/projects/${project.id}/edit`); onClose(); },
    }
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 z-30 rounded-lg border overflow-hidden py-1 min-w-40"
      style={{
        backgroundColor: "#1e1e1e",
        borderColor: "#2a2a2a",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      {acoes.map(({ label, icon: Icon, action }) => (
        <button
          key={label}
          onClick={action}
          className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary hover:text-white hover:bg-bg-card transition-all w-full text-left"
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
      <div className="border-t my-1" style={{ borderColor: "#2a2a2a" }} />
      <button
        onClick={() => { /* logic to remove project if needed */ onClose(); }}
        className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-400 hover:bg-red-400/10 transition-all w-full text-left"
      >
        <Trash2 size={13} />
        Eliminar Projecto
      </button>
    </div>
  );
};
