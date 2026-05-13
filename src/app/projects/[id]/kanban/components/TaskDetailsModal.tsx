"use client";

import { useEffect, useRef } from "react";
import { X, Calendar, User, AlignLeft, MessageSquare } from "lucide-react";
import { Task, TaskPriority } from "@/lib/store";

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
}

const priorityStyle: Record<TaskPriority, { color: string; bg: string }> = {
  low_priority: { color: "#555555", bg: "rgba(85,85,85,0.12)" },
  medium_priority: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  high_priority: { color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  critical_priority: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};
export const TaskDetailsModal = ({ task, onClose }: TaskDetailsModalProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const p = priorityStyle[task.priority];

  // Translation mapping for status and priority
  const statusMap: Record<string, string> = {
    todo: "A FAZER",
    in_progress: "EM PROGRESSO",
    review: "EM REVISÃO",
    done: "CONCLUÍDO",
  };

  const priorityMap: Record<string, string> = {
    low: "BAIXA",
    medium: "MÉDIA",
    high: "ALTA",
    critical: "CRÍTICA",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="w-full max-w-lg rounded-xl border overflow-hidden bg-bg-card border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider"
              style={{ color: p.color, backgroundColor: p.bg }}
            >
              {priorityMap[task.priority]}
            </span>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
              {statusMap[task.status]}
            </span>
          </div>
...
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-bg-card transition-colors"
          >
            <X size={14} className="text-text-muted" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
          <div>
            <h2 className="text-lg font-black text-white leading-tight">
              {task.title}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-bg-card flex items-center justify-center shrink-0">
                <User size={14} className="text-text-muted" />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">
                  Responsável
                </p>
                <p className="text-[13px] font-bold text-white">{task.assignee}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-bg-card flex items-center justify-center shrink-0">
                <Calendar size={14} className="text-text-muted" />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">
                  Data Limite
                </p>
                <p className="text-[13px] font-bold text-white">{task.dueDate}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">
              <AlignLeft size={12} /> Descrição
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {task.description || "Nenhuma descrição fornecida."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
