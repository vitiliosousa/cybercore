"use client";

import { Trash2 } from "lucide-react";
import { Project } from "@/lib/store";

interface DeleteProjectModalProps {
  project: Project;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteProjectModal = ({
  project,
  onClose,
  onConfirm,
}: DeleteProjectModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-bg-card overflow-hidden">
        
        <div className="p-6">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
            <Trash2 size={22} className="text-red-400" />
          </div>

          <h2 className="text-lg font-black text-white">
            Eliminar projecto
          </h2>

          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            Tens a certeza que desejas eliminar o projecto{" "}
            <span className="text-white font-semibold">
              {project.name}
            </span>
            ?
          </p>

          <p className="text-[12px] text-red-400 mt-3">
            Esta acção não poderá ser revertida.
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-border bg-bg-input text-text-muted font-semibold hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-lg bg-red-500 text-white font-black hover:opacity-90 transition-opacity"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};