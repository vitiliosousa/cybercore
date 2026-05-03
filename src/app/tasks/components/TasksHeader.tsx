"use client";

import { useRouter, usePathname } from "next/navigation";

export function TasksHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "Lista", path: "/tasks/list" },
    { name: "Timeline", path: "/tasks/timeline" },
  ];

  // Se estiver na raiz /tasks, assume Lista
  const isTabActive = (path: string) => {
    if (path === "/tasks/list" && (pathname === "/tasks" || pathname === "/tasks/list")) return true;
    return pathname === path;
  };

  return (
    <div className="flex items-center justify-between mb-6 shrink-0">
      <div>
        <h1 className="text-2xl font-black uppercase text-white tracking-tight">Todas as Tarefas</h1>
        <p className="text-[11px] text-text-muted mt-0.5">
          Gestão global de todas as tarefas do sistema
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="flex rounded-lg border overflow-hidden text-[11px] font-bold"
          style={{ borderColor: "#2a2a2a" }}
        >
          {tabs.map((tab) => {
            const active = isTabActive(tab.path);
            return (
              <button
                key={tab.name}
                className="px-3 py-1.5 uppercase tracking-wider transition-colors"
                style={
                  active
                    ? { backgroundColor: "#d3f000", color: "#000" }
                    : { backgroundColor: "#1a1a1a", color: "#555555" }
                }
                onClick={() => router.push(tab.path)}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
