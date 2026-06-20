"use client";

import { Task } from "@/lib/store";
import { STATUS_COLOR, PRIORITY_COLOR, ROW_H } from "./utils";

interface TimelineSidebarProps {
  tasks: (Task & { projectName?: string })[];
  onTaskClick: (task: Task) => void;
  title?: string;
}

export function TimelineSidebar({
  tasks,
  onTaskClick,
  title = "Tarefas",
}: TimelineSidebarProps) {
  return (
    <div
      className="w-72 shrink-0 flex flex-col border-r z-20"
      style={{ borderColor: "#1e1e1e", backgroundColor: "#0d0d0d" }}
    >
      {/* Header da coluna */}
      <div
        className="shrink-0 flex items-end px-4 border-b"
        style={{ height: "56px", borderColor: "#1e1e1e", backgroundColor: "#111" }}
      >
        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] pb-2">
          {title} ({tasks.length})
        </span>
      </div>

      {/* Lista de tarefas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {tasks.map((task, idx) => (
          <div
            key={`${task.id}-${idx}`}
            className="flex items-center gap-3 px-4 border-b cursor-pointer hover:bg-[#151515] transition-colors"
            style={{ height: `${ROW_H}px`, borderColor: "#1a1a1a" }}
            onClick={() => onTaskClick(task)}
          >
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: STATUS_COLOR[task.status] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-white truncate">{task.title}</p>
              {task.projectName && (
                <p className="text-[10px] text-accent font-black truncate uppercase tracking-tighter opacity-80">
                  {task.projectName}
                </p>
              )}
              {!task.projectName && task.assignee && (
                 <p className="text-[10px] text-text-muted truncate">{task.assignee}</p>
              )}
              {task.startDate && task.dueDate && (
                <p className="text-[9px] text-[#555] truncate">
                  {task.startDate} → {task.dueDate}
                </p>
              )}
            </div>
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: PRIORITY_COLOR[task.priority] }}
              title={task.priority}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
