"use client";

import { STATUS_MAP, STATUS_STYLE } from "./utils";

interface TaskStatusBadgeProps {
  status: string;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const color = STATUS_STYLE[status] || "#555555";
  const label = STATUS_MAP[status] || status;

  return (
    <span
      className="inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border whitespace-nowrap"
      style={{
        color:           color,
        borderColor:     `${color}30`,
        backgroundColor: `${color}10`,
      }}
    >
      {label}
    </span>
  );
}
