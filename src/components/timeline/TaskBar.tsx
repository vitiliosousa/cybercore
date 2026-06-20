"use client";

import { useState } from "react";
import { Task } from "@/lib/store";
import { STATUS_COLOR, STATUS_LABEL, PRIORITY_COLOR, COL_W, ROW_H, startOfDay, diffDays } from "./utils";
import { formatDate } from "@/components/tasks/utils";

interface TooltipProps {
  task: Task & { projectName?: string };
}

function Tooltip({ task }: TooltipProps) {
  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 rounded-lg border p-3 min-w-50 pointer-events-none"
      style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}
    >
      <p className="text-[12px] font-bold text-white mb-1">{task.title}</p>
      {task.projectName && (
        <p className="text-[10px] text-accent mb-1 uppercase font-black">{task.projectName}</p>
      )}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[task.status] }} />
        <span className="text-[10px] text-text-muted">{STATUS_LABEL[task.status]}</span>
        <span className="text-[10px]" style={{ color: PRIORITY_COLOR[task.priority] }}>
          · {task.priority.toUpperCase()}
        </span>
      </div>
      <p className="text-[10px] text-text-muted">Responsável: <span className="text-white">{task.assignee || "—"}</span></p>
      <div className="mt-2 pt-2 border-t border-[#333] flex flex-col gap-1">
        <p className="text-[10px]">
          <span className="text-green-400 font-black">INÍCIO</span>{" "}
          <span className="text-white">{formatDate(task.startDate)}</span>
        </p>
        <p className="text-[10px]">
          <span className="text-red-400 font-black">FIM</span>{" "}
          <span className="text-white">{formatDate(task.dueDate)}</span>
        </p>
      </div>
    </div>
  );
}

interface TaskBarProps {
  task: Task & { projectName?: string };
  rangeStart: Date;
  totalDays: number;
  onOpen: () => void;
}

export function TaskBar({
  task,
  rangeStart,
  totalDays,
  onOpen,
}: TaskBarProps) {
  const [hovered, setHovered] = useState(false);

  if (!task.startDate || !task.dueDate) return null;

  const start   = startOfDay(new Date(task.startDate));
  const end     = startOfDay(new Date(task.dueDate));
  const colFrom = diffDays(rangeStart, start);
  const colTo   = diffDays(rangeStart, end);

  if (colTo < 0 || colFrom > totalDays) return null;

  const clampedFrom = Math.max(0, colFrom);
  const clampedTo   = Math.min(totalDays - 1, colTo);
  const width       = Math.max(1, clampedTo - clampedFrom + 1);
  const isClippedL  = colFrom < 0;
  const isClippedR  = colTo >= totalDays;
  const color       = STATUS_COLOR[task.status];

  const startMarkerLeft = colFrom * COL_W;
  const endMarkerLeft   = (colTo + 1) * COL_W - 2;
  const showStartMarker = colFrom >= 0 && colFrom < totalDays;
  const showEndMarker   = colTo >= 0 && colTo < totalDays;

  return (
    <>
      {showStartMarker && (
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20"
          style={{ left: `${startMarkerLeft}px` }}
          title={`Início: ${formatDate(task.startDate)}`}
        >
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "5px solid #22c55e",
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
            }}
          />
        </div>
      )}

      {showEndMarker && (
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20"
          style={{ left: `${endMarkerLeft}px` }}
          title={`Fim: ${formatDate(task.dueDate)}`}
        >
          <div
            className="w-0 h-0"
            style={{
              borderRight: "5px solid #ef4444",
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
            }}
          />
        </div>
      )}

      <div
        className="absolute top-1/2 -translate-y-1/2 cursor-pointer transition-all duration-150 flex items-center px-2 select-none"
        style={{
          left:   `${clampedFrom * COL_W}px`,
          width:  `${width * COL_W}px`,
          height: `${ROW_H * 0.55}px`,
          backgroundColor: color,
          borderRadius: `${isClippedL ? 0 : 6}px ${isClippedR ? 0 : 6}px ${isClippedR ? 0 : 6}px ${isClippedL ? 0 : 6}px`,
          opacity: hovered ? 1 : 0.85,
          boxShadow: hovered ? `0 0 12px ${color}55` : "none",
          zIndex: hovered ? 20 : 10,
          borderLeft: showStartMarker && !isClippedL ? "2px solid #22c55e" : undefined,
          borderRight: showEndMarker && !isClippedR ? "2px solid #ef4444" : undefined,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onOpen}
      >
        <span
          className="text-[10px] font-black truncate w-full"
          style={{ color: task.status === "done" ? "#000" : task.status === "todo" ? "#aaa" : "#fff" }}
        >
          {task.title}
        </span>
        {hovered && <Tooltip task={task} />}
      </div>
    </>
  );
}
