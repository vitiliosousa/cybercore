"use client";

import { Task } from "@/lib/store";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { TaskRow } from "./TaskRow";

interface TaskTableProps {
  tasks: (Task & { projectName?: string; projectId: string })[];
  showProject?: boolean;
  onViewDetails: (task: Task) => void;
  emptyMessage?: string;
  emptySubMessage?: string;
  onClearSearch?: () => void;
  isSearching?: boolean;
}

export function TaskTable({
  tasks,
  showProject = true,
  onViewDetails,
  emptyMessage = "Nenhuma Tarefa Encontrada",
  emptySubMessage = "Ainda não existem tarefas registadas.",
  onClearSearch,
  isSearching = false,
}: TaskTableProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-y-auto pb-8">
      <div
        className="rounded-xl border overflow-hidden bg-[#0d0d0d]"
        style={{ borderColor: "#1f1f1f" }}
      >
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: showProject ? "26%" : "30%" }} />
            {showProject && <col style={{ width: "16%" }} />}
            <col style={{ width: "11%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: showProject ? "9%" : "15%" }} />
            <col style={{ width: showProject ? "4%" : "8%" }} />
          </colgroup>

          <thead>
            <tr
              className="text-[10px] font-black uppercase tracking-widest border-b text-text-muted"
              style={{ backgroundColor: "#111111", borderColor: "#1f1f1f" }}
            >
              <th className="text-left px-6 py-3 font-black">Tarefa</th>
              {showProject && <th className="text-left px-3 py-3 font-black">Projecto</th>}
              <th className="text-left px-3 py-3 font-black">Prazo</th>
              <th className="text-left px-3 py-3 font-black">Status</th>
              <th className="text-left px-3 py-3 font-black">Prioridade</th>
              <th className="text-left px-3 py-3 font-black">Responsável</th>
              <th className="text-right px-4 py-3 font-black">Acções</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-light">
            {tasks.map((task) => (
              <TaskRow
                key={`${task.projectId}-${task.id}`}
                task={task}
                showProject={showProject}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                onViewDetails={onViewDetails}
              />
            ))}

            {tasks.length === 0 && (
              <tr>
                <td colSpan={showProject ? 8 : 7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#111] flex items-center justify-center border border-[#222]">
                      <AlertCircle size={24} className="text-[#333]" />
                    </div>
                    <div>
                      <p className="text-white font-black text-sm uppercase tracking-wider">
                        {emptyMessage}
                      </p>
                      <p className="text-[11px] text-[#555] mt-1">
                        {emptySubMessage}
                      </p>
                      {isSearching && onClearSearch && (
                        <button
                          onClick={onClearSearch}
                          className="mt-3 text-[12px] font-semibold px-4 py-1.5 rounded-lg text-black hover:opacity-90"
                          style={{ backgroundColor: "#d3f000" }}
                        >
                          Limpar pesquisa
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
