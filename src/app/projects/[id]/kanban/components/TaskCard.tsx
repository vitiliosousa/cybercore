"use client";

import { GripVertical, Clock } from "lucide-react";
import { Task, TaskPriority } from "@/lib/store";

const priorityStyle: Record<TaskPriority, { color: string; bg: string }> = {
  low: { color: "#555555", bg: "rgba(85,85,85,0.12)" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  high: { color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function TaskCard({
  task,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging,
}: TaskCardProps) {
  const p = priorityStyle[task.priority];

  const priorityMap: Record<string, string> = {
    low: "BAIXA",
    medium: "MÉDIA",
    high: "ALTA",
    critical: "CRÍTICA",
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
        onDragStart(task.id);
      }}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-all duration-150 hover:bg-bg-card hover:scale-[1.01] hover:border-[#3a3a3a] shrink-0"
      style={{
        backgroundColor: "#1a1a1a",
        borderColor: "#2a2a2a",
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? "scale(0.97)" : "scale(1)",
      }}
    >
      <div className="flex items-start gap-2">
        <GripVertical size={13} className="text-[#333333] mt-0.5 shrink-0" />

        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-white mb-2 leading-tight">
            {task.title}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase"
              style={{ color: p.color, backgroundColor: p.bg }}
            >
              {priorityMap[task.priority]}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <div className="flex items-center gap-1 text-[10px] text-[#555]">
              <Clock size={9} />
              {task.startDate && task.dueDate
                ? `${task.startDate} → ${task.dueDate}`
                : task.dueDate || "—"}
            </div>

            {task.assignee && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-black"
                style={{ backgroundColor: "#d3f000" }}
              >
                {task.assignee.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
