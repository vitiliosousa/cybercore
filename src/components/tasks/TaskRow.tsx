"use client";

import { Task } from "@/lib/store";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskActionsMenu } from "./TaskActionsMenu";
import { STATUS_STYLE, STATUS_ICONS, formatDate, getDaysLeft } from "./utils";

interface TaskRowProps {
  task: Task & { projectName?: string; projectId: string };
  showProject?: boolean;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  onViewDetails: (task: Task) => void;
}

export function TaskRow({
  task,
  showProject = true,
  activeMenu,
  setActiveMenu,
  onViewDetails,
}: TaskRowProps) {
  const StatusIcon = STATUS_ICONS[task.status];
  const daysLeft = getDaysLeft(task.dueDate);

  return (
    <tr className="group transition-all duration-150 hover:bg-[#151515]">
      {/* Tarefa */}
      <td className="px-6 py-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onViewDetails(task)}
        >
          <div className="w-7 h-7 rounded-lg bg-bg-card flex items-center justify-center shrink-0 border border-border group-hover:border-[#d3f00050] transition-colors">
            <StatusIcon size={12} style={{ color: STATUS_STYLE[task.status] }} />
          </div>
          <span className="text-[13px] text-white font-bold truncate group-hover:text-accent transition-colors">
            {task.title}
          </span>
        </div>
      </td>

      {/* Projecto */}
      {showProject && (
        <td className="px-3 py-3">
          <Link
            href={`/projects/${task.projectId}/kanban`}
            className="text-[11px] font-bold text-text-secondary hover:text-accent transition-colors truncate block"
          >
            {task.projectName}
          </Link>
        </td>
      )}

      {/* Início */}
      <td className="px-3 py-3">
        <span className="text-[11px] text-text-muted whitespace-nowrap">
          {formatDate(task.startDate)}
        </span>
      </td>

      {/* Prazo */}
      <td className="px-3 py-3">
        <span
          className="text-[11px] whitespace-nowrap"
          style={{
            color: daysLeft < 0 ? "#ef4444" : daysLeft <= 3 ? "#f59e0b" : "#555555",
          }}
        >
          {formatDate(task.dueDate)}
        </span>
      </td>

      {/* Status */}
      <td className="px-3 py-3">
        <TaskStatusBadge status={task.status} />
      </td>

      {/* Prioridade */}
      <td className="px-3 py-3">
        <TaskPriorityBadge priority={task.priority} />
      </td>

      {/* Responsável */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-black shrink-0"
            style={{ backgroundColor: "#d3f000" }}
          >
            {task.assignee.charAt(0)}
          </div>
          <span className="text-[11px] text-text-secondary font-medium truncate">
            {task.assignee.split(" ")[0]}
          </span>
        </div>
      </td>

      {/* Acções */}
      <td className="px-4 py-3">
        <div className="flex justify-end relative">
          <button
            onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
            style={{
              backgroundColor: activeMenu === task.id ? "#d3f000" : "transparent",
              color:           activeMenu === task.id ? "#000" : "#555",
            }}
            aria-label="Mais opções"
          >
            <MoreVertical size={15} />
          </button>

          {activeMenu === task.id && (
            <TaskActionsMenu
              task={task}
              projectId={task.projectId}
              onViewDetails={() => onViewDetails(task)}
              onClose={() => setActiveMenu(null)}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
