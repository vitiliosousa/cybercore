"use client";

import { Search, Plus } from "lucide-react";

interface ProjectHeaderProps {
  count: number;
  search: string;
  onSearchChange: (val: string) => void;
  filter: string;
  onFilterChange: (val: "all" | "active" | "on_hold" | "completed") => void;
  onNewProject: () => void;
}

export const ProjectHeader = ({
  count,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  onNewProject,
}: ProjectHeaderProps) => {
  const filterLabels: Record<string, string> = {
    all: "Todos",
    active: "Activos",
    on_hold: "Em Pausa",
    completed: "Concluídos",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Projectos
          </h1>
          <p className="text-[11px] text-text-muted mt-1">
            <span>A acompanhar </span>
            <span className="text-accent">{count} </span>
            <span className="text-accent">{count === 1 ? "projecto" : "projectos"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-lg border overflow-hidden border-border">
            {(["all", "active", "on_hold", "completed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => onFilterChange(s)}
                className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors"
                style={
                  filter === s
                    ? { backgroundColor: "#d3f000", color: "#000" }
                    : { backgroundColor: "#1a1a1a", color: "#555555" }
                }
              >
                {filterLabels[s]}
              </button>
            ))}
          </div>
          <button
            onClick={onNewProject}
            className="flex items-center gap-2 text-[12px] font-black text-black px-4 py-2 rounded-lg transition-all hover:opacity-90 bg-accent"
          >
            <Plus size={13} className="text-black" />
            Novo Projecto
          </button>
        </div>
      </div>
      {/* FILTERS & SEARCH */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            size={16}
          />
          <input
            type="text"
            placeholder="Pesquisar projectos..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-border-light rounded-lg py-2 pl-10 pr-4 text-[13px] text-white outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
