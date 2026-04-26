"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore, Task, TaskStatus } from "@/lib/store";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, GripVertical, Clock, ChevronRight } from "lucide-react";

const columns: { id: TaskStatus; label: string; color: string; dot: string }[] = [
  { id: "todo", label: "To Do", color: "#555555", dot: "#555555" },
  { id: "in_progress", label: "In Progress", color: "#3b82f6", dot: "#3b82f6" },
  { id: "review", label: "Review", color: "#8b5cf6", dot: "#8b5cf6" },
  { id: "done", label: "Done", color: "#d3f000", dot: "#d3f000" },
];

const priorityStyle: Record<string, { color: string; bg: string }> = {
  low:      { color: "#555555", bg: "rgba(85,85,85,0.12)" },
  medium:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  high:     { color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

export default function KanbanPage() {
  const { isAuthenticated, projects, updateTaskStatus } = useAppStore();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const project = projects.find((p) => p.id === projectId);

  if (!isAuthenticated) return null;
  if (!project) return (
    <AppLayout>
      <div className="flex items-center justify-center h-full text-[#555555] text-sm">Project not found.</div>
    </AppLayout>
  );

  const tasksByStatus = (status: TaskStatus) => project.tasks.filter((t) => t.status === status);

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (dragging) {
      updateTaskStatus(projectId, dragging, status);
      setDragging(null);
      setDragOver(null);
    }
  };

  const doneTasks = project.tasks.filter((t) => t.status === "done").length;

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/projects")}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#1a1a1a] transition-colors"
            >
              <ArrowLeft size={14} className="text-[#8f8f8f]" />
            </button>
            <div>
              <h1 className="text-base font-black text-white">{project.name}</h1>
              <p className="text-[11px] text-[#555555]">Lead Engineer • {doneTasks}/{project.tasks.length} tasks done</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sub-nav */}
            <div className="flex rounded-lg border overflow-hidden text-[11px] font-bold" style={{ borderColor: "#2a2a2a" }}>
              {["Dashboard", "Kanban", "Sprints", "Team", "Settings"].map((tab) => (
                <button
                  key={tab}
                  className="px-3 py-1.5 uppercase tracking-wider transition-colors"
                  style={
                    tab === "Kanban"
                      ? { backgroundColor: "#d3f000", color: "#000" }
                      : { backgroundColor: "#1a1a1a", color: "#555555" }
                  }
                  onClick={() => {
                    if (tab === "Dashboard") router.push(`/projects/${projectId}/kanban`);
                    if (tab === "Sprints") router.push(`/projects/${projectId}/timeline`);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex rounded-lg border overflow-hidden text-[11px] font-bold" style={{ borderColor: "#2a2a2a" }}>
              {["Active Tasks", "Board View", "Backlog"].map((v) => (
                <button
                  key={v}
                  className="px-3 py-1.5 transition-colors"
                  style={
                    v === "Board View"
                      ? { backgroundColor: "#2a2a2a", color: "#8f8f8f" }
                      : { backgroundColor: "#1a1a1a", color: "#555555" }
                  }
                >
                  {v}
                </button>
              ))}
            </div>

            <button
              id="create-task-btn"
              onClick={() => router.push(`/tasks/create?project=${projectId}`)}
              className="flex items-center gap-1.5 text-[12px] font-black text-black px-3 py-2 rounded-lg transition-all hover:opacity-90"
              style={{ backgroundColor: "#d3f000" }}
            >
              <Plus size={13} className="text-black" /> Add Task
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="rounded-xl border p-4 mb-4 flex items-center gap-4" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
          <p className="text-[10px] font-black text-[#555555] uppercase tracking-widest shrink-0">Progress</p>
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${project.progress}%`, backgroundColor: "#d3f000" }}
            />
          </div>
          <span className="text-[12px] font-black text-white shrink-0">{project.progress}%</span>
        </div>

        {/* Kanban Columns */}
        <div className="flex gap-3 flex-1 overflow-x-auto pb-4">
          {columns.map(({ id, label, color, dot }) => {
            const tasks = tasksByStatus(id);
            const isOver = dragOver === id;
            return (
              <div
                key={id}
                className="flex flex-col shrink-0 w-[260px] rounded-xl transition-all"
                style={{
                  backgroundColor: isOver ? "rgba(211,240,0,0.03)" : "#111111",
                  border: isOver ? "1px solid rgba(211,240,0,0.2)" : "1px solid #1f1f1f",
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(id); }}
                onDrop={(e) => handleDrop(e, id)}
                onDragLeave={() => setDragOver(null)}
              >
                {/* Column header */}
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#1f1f1f" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
                    <span className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>
                      {label}
                    </span>
                    <span
                      className="text-[10px] font-black px-1.5 py-0.5 rounded-sm"
                      style={{ color, backgroundColor: `${dot}20` }}
                    >
                      {tasks.length}
                    </span>
                  </div>
                  <ChevronRight size={12} className="text-[#333333]" />
                </div>

                {/* Tasks */}
                <div className="flex flex-col gap-2 p-3 flex-1">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDragStart={() => setDragging(task.id)}
                      onDragEnd={() => { setDragging(null); setDragOver(null); }}
                      isDragging={dragging === task.id}
                    />
                  ))}

                  {tasks.length === 0 && (
                    <div
                      className="flex items-center justify-center h-16 rounded-lg border-2 border-dashed"
                      style={{ borderColor: "#2a2a2a" }}
                    >
                      <p className="text-[10px] text-[#333333] uppercase tracking-wider">Drop here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

function TaskCard({ task, onDragStart, onDragEnd, isDragging }: {
  task: Task;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  const p = priorityStyle[task.priority];
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-all hover:border-[#3a3a3a] group"
      style={{
        backgroundColor: "#1a1a1a",
        borderColor: "#2a2a2a",
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? "scale(0.97)" : "scale(1)",
      }}
    >
      <div className="flex items-start gap-2">
        <GripVertical size={13} className="text-[#333333] mt-0.5 shrink-0 group-hover:text-[#555555] transition-colors" />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-white leading-snug mb-2">{task.title}</p>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider"
              style={{ color: p.color, backgroundColor: p.bg }}
            >
              {task.priority}
            </span>
            {task.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wider"
                style={{ backgroundColor: "#2a2a2a", color: "#555555" }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: "#2a2a2a" }}>
            <div className="flex items-center gap-1 text-[10px] text-[#333333]">
              <Clock size={9} />
              {task.dueDate}
            </div>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-black"
              style={{ backgroundColor: "#d3f000" }}
              title={task.assignee}
            >
              {task.assignee.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
