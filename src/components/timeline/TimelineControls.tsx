"use client";

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { MESES_FULL, STATUS_LABEL, STATUS_COLOR } from "./utils";

interface TimelineControlsProps {
  refDate: Date;
  onNavigate: (dir: "prev" | "next") => void;
  onGoToToday: () => void;
}

export function TimelineControls({
  refDate,
  onNavigate,
  onGoToToday,
}: TimelineControlsProps) {
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center gap-2 bg-[#111] border border-[#222] rounded-lg p-1">
        <button
          onClick={() => onNavigate("prev")}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-bg-card text-text-muted hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={onGoToToday}
          className="px-3 py-1 text-[10px] font-black text-text-muted hover:text-white transition-colors"
        >
          Hoje
        </button>
        <div className="px-3 flex items-center gap-2 border-l border-r border-[#222]">
          <CalendarIcon size={13} className="text-accent" />
          <span className="text-[12px] font-black text-white uppercase tracking-wider min-w-44 text-center">
            {MESES_FULL[refDate.getMonth()]} {refDate.getFullYear()}
          </span>
        </div>
        <button
          onClick={() => onNavigate("next")}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-bg-card text-text-muted hover:text-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4">
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: STATUS_COLOR[key] }} />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
