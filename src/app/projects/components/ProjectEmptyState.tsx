"use client";

import { Search, Plus } from "lucide-react";

interface ProjectEmptyStateProps {
  search: string;
  onClearSearch: () => void;
  onNewProject: () => void;
}

export const ProjectEmptyState = ({
  search,
  onClearSearch,
  onNewProject,
}: ProjectEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-bg-card">
        <Search size={22} className="text-text-muted" />
      </div>
      <p className="text-white font-semibold text-sm mb-1">
        Nenhum projecto encontrado
      </p>
      <p className="text-text-muted text-[12px]">
        {search
          ? `Sem resultados para "${search}"`
          : "Comece por criar o seu primeiro projecto e organize o seu fluxo de trabalho de forma estruturada."}
      </p>
      {search ? (
        <button
          onClick={onClearSearch}
          className="mt-4 text-[12px] font-semibold px-4 py-2 rounded-lg text-black hover:opacity-90 bg-accent"
        >
          Limpar pesquisa
        </button>
      ) : (
        <button
          onClick={onNewProject}
          className="mt-4 text-[12px] font-semibold px-4 py-2 rounded-lg text-black hover:opacity-90 bg-accent flex items-center gap-2"
        >
          <Plus size={13} /> Criar Projecto
        </button>
      )}
    </div>
  );
};
