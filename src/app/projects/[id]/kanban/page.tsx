"use client";

import { useAppStore, Task, TaskStatus } from "@/lib/store";
import { useParams } from "next/navigation";
import { useState } from "react";
import { TaskDetailsModal } from "../kanban/components/TaskDetailsModal";
import { KanbanColumn } from "../kanban/components/KanbanColumn";
import { TaskModal } from "../kanban/components/TaskModal";

const columns: { id: TaskStatus; label: string; color: string; dot: string }[] =
  [
    { id: "todo", label: "A Fazer", color: "#555555", dot: "#555555" },
    {
      id: "in_progress",
      label: "Em Progresso",
      color: "#3b82f6",
      dot: "#3b82f6",
    },
    { id: "review", label: "Revisão", color: "#8b5cf6", dot: "#8b5cf6" },
    { id: "done", label: "Concluído", color: "#d3f000", dot: "#d3f000" },
  ];

export default function KanbanPage() {
  const { projects, editTaskStatus } = useAppStore();
  const params = useParams();
  const projectId = params.id as string;

  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [initialStatus, setInitialStatus] = useState<TaskStatus>("todo");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const project = projects.find((p) => p.id === projectId);

  if (!project) return null;

  const tasksByStatus = (status: TaskStatus) =>
    project.tasks.filter((t) => t.status === status);

  const handleDrop = (status: TaskStatus) => {
    if (dragging) {
      editTaskStatus(projectId, dragging, {status: status});
      setDragging(null);
      setDragOver(null);
    }
  };

  const openAddModal = (status: TaskStatus = "todo") => {
    setInitialStatus(status);
    setShowAddModal(true);
  };

  return (
    <>
      {/* KANBAN BOARD */}
      <div className="flex gap-3 flex-1 overflow-x-auto pb-4 items-start">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            {...col}
            tasks={tasksByStatus(col.id)}
            dragOver={dragOver}
            dragging={dragging}
            onDragOver={setDragOver}
            onDragLeave={() => setDragOver(null)}
            onDrop={handleDrop}
            onTaskClick={setSelectedTask}
            onDragStart={setDragging}
            onDragEnd={() => {
              setDragging(null);
              setDragOver(null);
            }}
            onAddTask={openAddModal}
          />
        ))}
      </div>

      {/* MODALS */}
      {showAddModal && (
        <TaskModal
          projectId={projectId}
          initialStatus={initialStatus}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => setShowAddModal(false)}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}
