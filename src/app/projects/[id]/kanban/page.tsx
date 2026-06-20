"use client";

import { useAppStore, Task, TaskStatus } from "@/lib/store";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";
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
  const { projects, updateTaskStatus } = useAppStore();
  const params = useParams();
  const projectId = params.id as string;

  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const draggedRef = useRef(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [initialStatus, setInitialStatus] = useState<TaskStatus>("todo");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const project = projects.find((p) => p.id === projectId);

  if (!project) return null;

  const tasksByStatus = (status: TaskStatus) =>
    project.tasks.filter((t) => t.status === status);

  const handleDrop = async (status: TaskStatus) => {
    const taskId = dragging;
    setDragging(null);
    setDragOver(null);

    if (!taskId) return;

    const task = project.tasks.find((t) => t.id === taskId);
    if (!task || task.status === status) return;

    setStatusError(null);
    try {
      await updateTaskStatus(projectId, taskId, status);
    } catch {
      setStatusError("Erro ao mover tarefa. Tente novamente.");
    }
  };

  const openAddModal = (status: TaskStatus = "todo") => {
    setInitialStatus(status);
    setShowAddModal(true);
  };

  return (
    <>
      {statusError && (
        <div className="mb-3 px-4 py-2 rounded-lg text-xs text-red-400 bg-red-400/10 border border-red-400/20">
          {statusError}
        </div>
      )}

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
            onTaskClick={(task) => {
              if (!draggedRef.current) setSelectedTask(task);
            }}
            onDragStart={(taskId) => {
              draggedRef.current = false;
              setDragging(taskId);
            }}
            onDragEnd={() => {
              draggedRef.current = true;
              setTimeout(() => {
                draggedRef.current = false;
              }, 100);
              setDragging(null);
              setDragOver(null);
            }}
            onAddTask={openAddModal}
          />
        ))}
      </div>

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
