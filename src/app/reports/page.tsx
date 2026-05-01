"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckSquare, Clock, TrendingUp, Users } from "lucide-react";

export default function ReportsPage() {
  const { isAuthenticated, isInitialized, projects, teamMembers } = useAppStore();
  const router = useRouter();
  useEffect(() => { 
    if (isInitialized && !isAuthenticated) router.push("/login"); 
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || !isAuthenticated) return null;

  const allTasks = projects.flatMap((p) => p.tasks);
  const done = allTasks.filter((t) => t.status === "done").length;
  const inProgress = allTasks.filter((t) => t.status === "in_progress").length;
  const review = allTasks.filter((t) => t.status === "review").length;
  const todo = allTasks.filter((t) => t.status === "todo").length;
  const total = allTasks.length;
  const avgProgress = Math.round(projects.reduce((a, p) => a + p.progress, 0) / Math.max(projects.length, 1));

  const velocityData = [65, 72, 58, 81, 76, 90, 84];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxVel = Math.max(...velocityData);

  const priorityBreakdown = [
    { label: "Critical", count: allTasks.filter((t) => t.priority === "critical").length, color: "#ef4444" },
    { label: "High", count: allTasks.filter((t) => t.priority === "high").length, color: "#f97316" },
    { label: "Medium", count: allTasks.filter((t) => t.priority === "medium").length, color: "#f59e0b" },
    { label: "Low", count: allTasks.filter((t) => t.priority === "low").length, color: "#555555" },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <p className="text-[11px] text-[#555555] mb-6 uppercase tracking-widest">Performance analytics across all active projects.</p>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Tasks Completed", value: done, color: "#d3f000", icon: CheckSquare },
            { label: "In Progress", value: inProgress, color: "#3b82f6", icon: Clock },
            { label: "Avg. Completion", value: `${avgProgress}%`, color: "#8b5cf6", icon: TrendingUp },
            { label: "Active Members", value: teamMembers.filter((m) => m.status === "active").length, color: "#d3f000", icon: Users },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="rounded-xl border p-5" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${color}18` }}>
                <Icon size={15} style={{ color }} />
              </div>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-[10px] text-[#555555] uppercase tracking-widest mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Task Status */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest mb-5">Task Status</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: "Done", count: done, color: "#d3f000" },
                { label: "In Progress", count: inProgress, color: "#3b82f6" },
                { label: "In Review", count: review, color: "#8b5cf6" },
                { label: "To Do", count: todo, color: "#333333" },
              ].map(({ label, count, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[#8f8f8f]">{label}</span>
                    </div>
                    <span className="font-black text-white">{count}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                    <div className="h-full rounded-full" style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%", backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Velocity chart */}
          <div className="lg:col-span-2 rounded-xl border p-5" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest mb-5">Team Velocity — This Week</h2>
            <div className="flex items-end gap-3 h-28">
              {velocityData.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[9px] text-[#555555] font-bold">{val}%</span>
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{ height: `${(val / maxVel) * 100}%`, backgroundColor: i === velocityData.length - 1 ? "#d3f000" : "#2a2a2a" }}
                  />
                  <span className="text-[9px] text-[#333333] uppercase tracking-wider">{days[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest mb-5">Priority Breakdown</h2>
            <div className="flex flex-col gap-3">
              {priorityBreakdown.map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[11px] text-[#8f8f8f]">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                      <div className="h-full rounded-full" style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%", backgroundColor: color }} />
                    </div>
                    <span className="text-[11px] font-black text-white w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Progress */}
          <div className="lg:col-span-2 rounded-xl border p-5" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest mb-5">Project Progress</h2>
            <div className="flex flex-col gap-4">
              {projects.map((p) => (
                <div key={p.id}>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-semibold text-white cursor-pointer hover:text-[#d3f000] transition-colors" onClick={() => router.push(`/projects/${p.id}/kanban`)}>
                      {p.name}
                    </span>
                    <span className="text-[#555555]">
                      {p.tasks.filter((t) => t.status === "done").length}/{p.tasks.length} tasks • <span className="font-black text-white">{p.progress}%</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: "#d3f000" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
