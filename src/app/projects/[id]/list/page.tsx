"use client";

import { useAppStore, Task, TaskStatus } from "@/lib/store";
import { useParams } from "next/navigation";
import {
  Clock,
  MoreVertical,
  CheckCircle2,
  Circle,
  Clock3,
  AlertCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { TaskDetailsModal } from "../kanban/components/TaskDetailsModal";

const statusStyle: Record<string, string> = {
  todo: "#555555",
  in_progress: "#3b82f6",
  review: "#8b5cf6",
  done: "#d3f000",
};

const statusMap: Record<string, string> = {
  todo: "A FAZER",
  in_progress: "EM PROGRESSO",
  review: "EM REVISÃO",
  done: "CONCLUÍDO",
};

const statusIcons: Record<string, any> = {
  todo: Circle,
  in_progress: Clock3,
  review: AlertCircle,
  done: CheckCircle2,
};

const priorityStyle: Record<string, { color: string; bg: string }> = {
  low: { color: "#555555", bg: "rgba(85,85,85,0.12)" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  high: { color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const priorityMap: Record<string, string> = {
  low: "BAIXA",
  medium: "MÉDIA",
  high: "ALTA",
  critical: "CRÍTICA",
};

export default function ProjectListPage() {
  const { projects, updateTaskStatus } = useAppStore();
  const params = useParams();
  const projectId = params.id as string;

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const project = projects.find((p) => p.id === projectId);

  if (!project) return null;

  const tasks = project.tasks;

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(projectId, taskId, status);
    setActiveMenu(null);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div
        className="rounded-xl border overflow-visible bg-[#0d0d0d] border-border-light">
        {/* HEADER */}
        <div
          className="grid grid-cols-12 px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b bg-bg-sidebar border-border-light text-text-muted">
          <div className="col-span-4">Tarefa</div>
          <div className="col-span-2 text-center">Data</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Prioridade</div>
          <div className="col-span-1">Responsável</div>
          <div className="col-span-1 text-right pr-4">Ações</div>
        </div>

        {/* TASKS */}
        <div className="divide-y divide-border-light">
          {tasks.map((task) => {
            const p = priorityStyle[task.priority];
            const StatusIcon = statusIcons[task.status];
            return (
              <div
                key={task.id}
                className="grid grid-cols-12 items-center px-6 py-2.5 text-[12px] transition-all duration-150 group hover:bg-[#151515]"
              >
                {/* TITLE */}
                <div
                  className="col-span-4 flex items-center gap-3 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="w-7 h-7 rounded-lg bg-bg-card flex items-center justify-center shrink-0 border border-border group-hover:border-[#d3f00050] transition-colors">
                    <StatusIcon
                      size={12}
                      style={{ color: statusStyle[task.status] }}
                    />
                  </div>
                  <span className="text-white font-bold truncate group-hover:text-accent transition-colors">
                    {task.title}
                  </span>
                </div>

                {/* DATE */}
                <div className="col-span-2 text-center">
                  <span className="text-[11px] font-medium text-text-muted">
                    {task.dueDate}
                  </span>
                </div>

                {/* STATUS */}
                <div className="col-span-2">
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{
                      color: statusStyle[task.status],
                      borderColor: `${statusStyle[task.status]}30`,
                      backgroundColor: `${statusStyle[task.status]}10`,
                    }}
                  >
                    {statusMap[task.status]}
                  </span>
                </div>

                {/* PRIORITY */}
                <div className="col-span-2">
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-sm uppercase"
                    style={{ color: p.color, backgroundColor: p.bg }}
                  >
                    {priorityMap[task.priority]}
                  </span>
                </div>

                {/* ASSIGNEE */}
                <div className="col-span-1 flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-black shrink-0"
                    style={{ backgroundColor: "#d3f000" }}
                  >
                    {task.assignee.charAt(0)}
                  </div>
                  <span className="text-text-secondary font-medium text-[11px] truncate">
                    {task.assignee.split(" ")[0]}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="col-span-1 flex justify-end relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === task.id ? null : task.id)
                    }
                    className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#222] transition-colors text-[#555] hover:text-white"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {activeMenu === task.id && (
                    <div
                      className="absolute right-0 top-10 w-48 rounded-lg border bg-bg-card shadow-xl z-10 py-1 overflow-hidden"
                      style={{ borderColor: "#2a2a2a" }}
                    >
                      <p className="px-3 py-2 text-[10px] font-black text-[#555] uppercase tracking-widest border-b border-[#222]">
                        Mudar Status
                      </p>
                      {Object.keys(statusMap).map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            handleStatusChange(task.id, s as TaskStatus)
                          }
                          className={`w-full text-left px-3 py-2 text-[11px] font-bold hover:bg-[#222] transition-colors flex items-center gap-2 ${task.status === s ? "text-accent" : "text-text-secondary"}`}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: statusStyle[s] }}
                          />
                          {statusMap[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {tasks.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#111] flex items-center justify-center border border-[#222]">
                <AlertCircle size={24} className="text-[#333]" />
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-wider">
                  Sem Tarefas
                </p>
                <p className="text-[11px] text-[#555] mt-1">
                  Este projecto ainda não possui tarefas registadas.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE DETALHES */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
