"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore } from "@/lib/store";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const statusColor: Record<string, string> = {
  todo: "#333333",
  in_progress: "#3b82f6",
  review: "#8b5cf6",
  done: "#d3f000",
};

export default function TimelinePage() {
  const { isAuthenticated, projects } = useAppStore();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string | undefined;

  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;

  const project = projectId ? projects.find((p) => p.id === projectId) : null;
  const displayProjects = project ? [project] : projects;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          {projectId && (
            <button onClick={() => router.push(`/projects/${projectId}/kanban`)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#1a1a1a] transition-colors">
              <ArrowLeft size={14} className="text-[#8f8f8f]" />
            </button>
          )}
          <div>
            <h1 className="text-base font-black text-white">{project ? `${project.name} — Timeline` : "All Projects Timeline"}</h1>
            <p className="text-[11px] text-[#555555]">Track milestones and task progress</p>
          </div>
        </div>

        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
          {/* Header */}
          <div className="flex border-b" style={{ borderColor: "#2a2a2a" }}>
            <div className="w-52 shrink-0 px-5 py-3 text-[10px] font-black text-[#555555] uppercase tracking-widest border-r" style={{ borderColor: "#2a2a2a" }}>
              Project / Task
            </div>
            <div className="flex-1 flex">
              {MONTHS.map((m) => (
                <div key={m} className="flex-1 text-center text-[10px] font-black text-[#555555] uppercase tracking-widest py-3 border-r last:border-r-0 min-w-14" style={{ borderColor: "#2a2a2a" }}>
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div>
            {displayProjects.map((p, pi) => {
              const barStart = Math.min(pi * 4 + 1, 20);
              const barWidth = Math.max(Math.round((p.progress / 100) * 20), 2);
              return (
                <div key={p.id}>
                  {/* Project row */}
                  <div className="flex hover:bg-[#1f1f1f] transition-colors group border-b" style={{ borderColor: "#1f1f1f" }}>
                    <div className="w-52 shrink-0 px-5 py-3 flex items-center gap-2 border-r" style={{ borderColor: "#2a2a2a" }}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#d3f000" }} />
                      <span className="text-[12px] font-bold text-white truncate cursor-pointer group-hover:text-[#d3f000] transition-colors" onClick={() => router.push(`/projects/${p.id}/kanban`)}>
                        {p.name}
                      </span>
                    </div>
                    <div className="flex-1 relative py-3 px-2">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-5 rounded-full flex items-center px-2"
                        style={{ left: `${(barStart / 24) * 100}%`, width: `${(barWidth / 24) * 100}%`, backgroundColor: "#d3f000" }}
                      >
                        <span className="text-[9px] text-black font-black truncate">{p.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Task rows */}
                  {p.tasks.map((task, ti) => (
                    <div key={task.id} className="flex hover:bg-[#1a1a1a] transition-colors border-b" style={{ borderColor: "#1f1f1f" }}>
                      <div className="w-52 shrink-0 px-5 py-2 flex items-center gap-2 border-r pl-9" style={{ borderColor: "#2a2a2a" }}>
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: statusColor[task.status] }} />
                        <span className="text-[11px] text-[#555555] truncate">{task.title}</span>
                      </div>
                      <div className="flex-1 relative py-2 px-2">
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-3 rounded-full opacity-80"
                          style={{ left: `${(Math.min(barStart + ti, 20) / 24) * 100}%`, width: `${(3 / 24) * 100}%`, backgroundColor: statusColor[task.status] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4">
          {[["To Do", "#333333"], ["In Progress", "#3b82f6"], ["In Review", "#8b5cf6"], ["Done", "#d3f000"]].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-[#555555] uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
