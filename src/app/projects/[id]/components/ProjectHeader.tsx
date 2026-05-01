"use client";

import { useAppStore, TaskStatus } from "@/lib/store";
import { useRouter, useParams, usePathname } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { TaskModal } from "../kanban/components/TaskModal";

export function ProjectHeader() {
  const { projects } = useAppStore();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.id as string;

  const [showAddModal, setShowAddModal] = useState(false);

  const project = projects.find((p) => p.id === projectId);

  if (!project) return null;

  const doneTasks = project.tasks.filter((t) => t.status === "done").length;

  const tabs = [
    { name: "Kanban", path: `/projects/${projectId}/kanban` },
    { name: "Lista", path: `/projects/${projectId}/list` },
    { name: "Timeline", path: `/projects/${projectId}/timeline` },
  ];

  const currentTab = tabs.find(tab => pathname.includes(tab.path))?.name || "Kanban";

  return (
    <>
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/projects")}
            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-bg-card transition-colors"
          >
            <ArrowLeft size={14} className="text-text-secondary" />
          </button>

          <div>
            <h1 className="text-base font-black text-white">
              {project.name}
            </h1>
            <p className="text-[11px] text-text-muted">
              {project.status.toUpperCase()} • {doneTasks}/
              {project.tasks.length} tarefas • Expira em {project.dueDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* SUB NAV */}
          <div
            className="flex rounded-lg border overflow-hidden text-[11px] font-bold"
            style={{ borderColor: "#2a2a2a" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className="px-3 py-1.5 uppercase tracking-wider transition-colors"
                style={
                  pathname.includes(tab.path)
                    ? { backgroundColor: "#d3f000", color: "#000" }
                    : { backgroundColor: "#1a1a1a", color: "#555555" }
                }
                onClick={() => router.push(tab.path)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-[12px] font-black text-black px-3 py-2 rounded-lg hover:opacity-90"
            style={{ backgroundColor: "#d3f000" }}
          >
            <Plus size={13} />
            Nova Tarefa
          </button>
        </div>
      </div>

      {showAddModal && (
        <TaskModal
          projectId={projectId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}
