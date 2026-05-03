"use client";

import { PRIORITY_MAP, PRIORITY_STYLE } from "./utils";

interface TaskPriorityBadgeProps {
  priority: string;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const style = PRIORITY_STYLE[priority] || { color: "#555555", bg: "rgba(85,85,85,0.12)" };
  const label = PRIORITY_MAP[priority] || priority;

  return (
    <span
      className="inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-sm uppercase whitespace-nowrap"
      style={{ color: style.color, backgroundColor: style.bg }}
    >
      {label}
    </span>
  );
}
