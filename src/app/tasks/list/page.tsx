"use client";

import { useAppStore, Task } from "@/lib/store";
import { useState, useMemo } from "react";
import { TaskDetailsModal } from "../../projects/[id]/kanban/components/TaskDetailsModal";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskSearchBar } from "@/components/tasks/TaskSearchBar";

export default function GlobalTasksListPage() {
  const { projects } = useAppStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery]   = useState("");

  const allTasks = useMemo(() => 
    projects.flatMap((p) =>
      p.tasks.map((t) => ({ ...t, projectId: p.id, projectName: p.name }))
    ), [projects]
  );

  const filteredTasks = useMemo(() => 
    allTasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
    ), [allTasks, searchQuery]
  );

  return (
    <>
      {/* ── Pesquisa ── */}
      <div className="mb-5 flex items-center justify-between">
        <TaskSearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Pesquisar tarefas, projectos ou responsáveis..." 
        />

        <p className="text-[11px] text-text-muted">
          {filteredTasks.length} {filteredTasks.length === 1 ? "tarefa encontrada" : "tarefas encontradas"}
        </p>
      </div>

      {/* ── Tabela ── */}
      <TaskTable 
        tasks={filteredTasks} 
        onViewDetails={setSelectedTask} 
        isSearching={!!searchQuery}
        onClearSearch={() => setSearchQuery("")}
        emptySubMessage={searchQuery ? `Sem resultados para "${searchQuery}"` : "Ainda não existem tarefas registadas."}
      />

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}
