"use client";

import { useEffect, useRef } from "react";
import { useAppStore, Task, TaskStatus } from "@/lib/store";
import { Eye, Trash2 } from "lucide-react";
import { STATUS_MAP, STATUS_STYLE } from "./utils";

interface TaskActionsMenuProps {
  task: Task;
  projectId: string;
  onViewDetails: () => void;
  onClose: () => void;
}

export function TaskActionsMenu({
  task,
  projectId,
  onViewDetails,
  onClose,
}: TaskActionsMenuProps) {
  const { updateTaskStatus, deleteTask } = useAppStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleStatus = async (s: TaskStatus) => {
    await updateTaskStatus(projectId, task.id, s);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 w-52 rounded-lg border py-1 overflow-hidden z-50"
      style={{
        backgroundColor: "#1e1e1e",
        borderColor: "#2a2a2a",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div className="pb-1 border-b" style={{ borderColor: "#2a2a2a" }}>
        <button
          onClick={() => { onViewDetails(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] text-text-secondary hover:text-white hover:bg-bg-card transition-all"
        >
          <Eye size={13} /> Ver Detalhes
        </button>
      </div>

      <p className="px-3 py-1.5 text-[9px] font-black text-[#444] uppercase tracking-widest">
        Mudar Status
      </p>
      {(Object.keys(STATUS_MAP) as TaskStatus[]).map((s) => (
        <button
          key={s}
          onClick={() => handleStatus(s)}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] hover:bg-bg-card transition-all"
          style={{ color: task.status === s ? STATUS_STYLE[s] : "#888" }}
        >
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_STYLE[s] }} />
          {STATUS_MAP[s]}
          {task.status === s && (
            <span className="ml-auto text-[9px] font-black" style={{ color: STATUS_STYLE[s] }}>✓</span>
          )}
        </button>
      ))}

      <div className="border-t mt-1 pt-1" style={{ borderColor: "#2a2a2a" }}>
        <button
          onClick={async () => {
            if (confirm(`Eliminar a tarefa "${task.title}"?`)) {
              await deleteTask(projectId, task.id);
            }
            onClose();
          }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] text-red-400 hover:bg-red-400/10 transition-all"
        >
          <Trash2 size={13} /> Eliminar Tarefa
        </button>
      </div>
    </div>
  );
}
