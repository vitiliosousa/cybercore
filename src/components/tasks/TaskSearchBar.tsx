"use client";

import { Search } from "lucide-react";

interface TaskSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TaskSearchBar({
  value,
  onChange,
  placeholder = "Pesquisar tarefas...",
}: TaskSearchBarProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-2 border w-full max-w-md"
      style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
    >
      <Search size={13} className="text-text-muted shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-[13px] text-white placeholder:text-text-muted outline-none flex-1"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-text-muted hover:text-white transition-colors text-[11px]"
        >
          ✕
        </button>
      )}
    </div>
  );
}
