"use client";

import { Plus } from "lucide-react";
import { Task, TaskStatus } from "@/lib/store";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  id: TaskStatus;
  label: string;
  color: string;
  dot: string;
  tasks: Task[];
  dragOver: TaskStatus | null;
  dragging: string | null;
  onDragOver: (id: TaskStatus) => void;
  onDragLeave: () => void;
  onDrop: (status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanColumn({
  id,
  label,
  color,
  dot,
  tasks,
  dragOver,
  dragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onTaskClick,
  onDragStart,
  onDragEnd,
  onAddTask,
}: KanbanColumnProps) {
  const isOver = dragOver === id;

  return (
    <div
      className="flex flex-col shrink-0 w-72 max-h-full rounded-xl transition-all"
      style={{
        backgroundColor: "#111111",
        border: isOver ? "1px solid #d3f000" : "1px solid #1f1f1f",
        boxShadow: isOver ? "0 0 0 1px rgba(211,240,0,0.2)" : "none",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOver !== id) onDragOver(id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(id);
      }}
      onDragLeave={(e) => {
        // Só dispara se o mouse saiu para fora da coluna de fato
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onDragLeave();
        }
      }}
    >
      {/* HEADER DA COLUNA */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: dot }}
          />
          <span
            className="text-[11px] font-black uppercase tracking-widest"
            style={{ color }}
          >
            {label}
          </span>
          <span
            className="text-[10px] font-black px-1.5 py-0.5 rounded-sm"
            style={{ color, backgroundColor: `${dot}20` }}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* TASKS */}
      <div className="flex flex-col gap-2 p-3 overflow-y-auto min-h-0 flex-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onDragStart={() => onDragStart(task.id)}
            onDragEnd={onDragEnd}
            isDragging={dragging === task.id}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-16 rounded-lg border-2 border-dashed border-border shrink-0">
            <p className="text-[10px] text-[#333333] uppercase">Solte aqui</p>
          </div>
        )}
      </div>

      {/* FOOTER DA COLUNA - ADD TASK */}
      <div className="p-3 border-t border-border-light shrink-0">
        <button
          onClick={() => onAddTask(id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold text-text-muted hover:text-white hover:bg-bg-card transition-all"
        >
          <Plus size={12} />
          Adicionar Tarefa
        </button>
      </div>
    </div>
  );
}
