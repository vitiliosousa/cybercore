"use client";

import { CheckSquare } from "lucide-react";
import { Task } from "@/lib/store";
import { STATUS_STYLE, STATUS_MAP, STATUS_ICONS, formatDate, PRIORITY_STYLE, PRIORITY_MAP } from "@/components/tasks/utils";

interface ProfileTasksListProps {
  tasks: (Task & { projectName: string; projectId: string })[];
  stats: {
    pending: number;
    done: number;
  };
}

export function ProfileTasksList({ tasks, stats }: ProfileTasksListProps) {
  return (
    <div
      className="lg:col-span-2 rounded-xl border overflow-hidden"
      style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
    >
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "#2a2a2a", backgroundColor: "#111" }}
      >
        <div className="flex items-center gap-2">
          <CheckSquare size={13} style={{ color: "#d3f000" }} />
          <h2 className="text-[11px] font-black text-white uppercase tracking-widest">
            Tarefas Atribuídas
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-text-muted">
          <span className="flex items-center gap-1">
            <span className="font-black text-white">{stats.pending}</span> pendentes
          </span>
          <span className="flex items-center gap-1">
            <span className="font-black" style={{ color: "#d3f000" }}>{stats.done}</span> concluídas
          </span>
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: "#222" }}>
        {tasks.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[12px] text-text-muted">Nenhuma tarefa atribuída.</p>
          </div>
        ) : (
          tasks.map((task) => {
            const Icon = STATUS_ICONS[task.status];
            const p    = PRIORITY_STYLE[task.priority];
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-border-light transition-colors"
              >
                {/* Ícone de status */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${STATUS_STYLE[task.status]}10`,
                    borderColor:     `${STATUS_STYLE[task.status]}25`,
                  }}
                >
                  <Icon size={12} style={{ color: STATUS_STYLE[task.status] }} />
                </div>

                {/* Título + projecto */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate">{task.title}</p>
                  <p className="text-[10px] text-text-muted truncate">{task.projectName}</p>
                </div>

                {/* Prioridade */}
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-sm uppercase shrink-0"
                  style={{ color: p.color, backgroundColor: p.bg }}
                >
                  {PRIORITY_MAP[task.priority]}
                </span>

                {/* Status */}
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full border shrink-0"
                  style={{
                    color:           STATUS_STYLE[task.status],
                    borderColor:     `${STATUS_STYLE[task.status]}30`,
                    backgroundColor: `${STATUS_STYLE[task.status]}10`,
                  }}
                >
                  {STATUS_MAP[task.status]}
                </span>

                {/* Data */}
                <span className="text-[10px] text-text-muted shrink-0 hidden sm:block">
                  {formatDate(task.dueDate)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
