"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore, Project } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Zap } from "lucide-react";

const recentActivity = [
  { user: "David Chen", action: "completed 4 tasks in", target: "Alpha Sprint", time: "2 minutes ago", dot: "#d3f000" },
  { user: "System", action: "automatically assigned 12 issues to", target: "UI/UX Team", time: "14 minutes ago", dot: "#3b82f6" },
  { user: "Sarah Jenkins", action: "uploaded 3 new assets to", target: "Quantum Project", time: "1 hour ago", dot: "#8b5cf6" },
  { user: "Warning", action: "Deadline approaching for", target: "Security Audit", time: "3 hours ago", dot: "#f59e0b" },
];

interface DashboardStats {
  pendingTasks: number;
  activeProjects: number;
  upcomingDeadlines: number;
  projectsWithDays: (Project & { daysLeft: number })[];
}

export default function DashboardPage() {
  const { isAuthenticated, projects } = useAppStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isMounted) return;
    
    const now = Date.now();
    const allTasks = projects.flatMap((p) => p.tasks);
    const pendingTasks = allTasks.filter((t) => t.status !== "done").length;
    const activeProjects = projects.filter((p) => p.status === "active").length;
    const upcomingDeadlines = projects.filter((p) => {
      const days = Math.ceil((new Date(p.dueDate).getTime() - now) / 86400000);
      return days >= 0 && days <= 14;
    }).length;

    const projectsWithDays = projects.map(p => ({
      ...p,
      daysLeft: Math.ceil((new Date(p.dueDate).getTime() - now) / 86400000)
    }));

    setStats({
      pendingTasks,
      activeProjects,
      upcomingDeadlines,
      projectsWithDays
    });
  }, [isMounted, projects]);

  if (!isAuthenticated || !isMounted || !stats) return null;

  const kpis = [
    { label: "Active Projects", value: stats.activeProjects, badge: "+2 THIS WEEK", badgeColor: "#d3f000" },
    { label: "Pending Tasks", value: stats.pendingTasks, badge: "-9% DECREASE", badgeColor: "#22c55e" },
    { label: "Team Efficiency", value: "94.8%", badge: "OPTIMIZED", badgeColor: "#d3f000" },
    { label: "Upcoming Deadlines", value: `0${stats.upcomingDeadlines}`, badge: `${stats.upcomingDeadlines} URGENT`, badgeColor: "#ef4444" },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black text-white tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold" style={{ color: "#d3f000", borderColor: "rgba(211,240,0,0.3)", backgroundColor: "rgba(211,240,0,0.08)" }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#d3f000" }} />
                SYSTEM LIVE
              </div>
            </div>
            <p className="text-text-muted text-xs">
              Monitoring real-time operational efficiency across{" "}
              <span className="font-semibold" style={{ color: "#d3f000" }}>{stats.activeProjects} active initiatives</span>.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {kpis.map(({ label, value, badge, badgeColor }) => (
            <div
              key={label}
              className="rounded-xl border p-4 flex flex-col gap-3"
              style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
            >
              <div className="flex items-center justify-between">
                <span
                  suppressHydrationWarning
                  className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm uppercase"
                  style={{ color: badgeColor === "#ef4444" ? "#ef4444" : "#000", backgroundColor: badgeColor === "#ef4444" ? "rgba(239,68,68,0.12)" : badgeColor }}
                >
                  {badge}
                </span>
              </div>
              <div>
                <p suppressHydrationWarning className="text-3xl font-black text-white tracking-tight">{value}</p>
                <p className="text-[11px] text-text-muted mt-0.5 uppercase tracking-wider">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Project */}
          <div className="lg:col-span-2 rounded-xl border overflow-hidden" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "#2a2a2a" }}>
              <h2 className="text-xs font-black text-white uppercase tracking-widest">Project</h2>
              <button
                onClick={() => router.push("/projects")}
                className="flex items-center gap-1 text-[11px] font-semibold transition-colors hover:opacity-80"
                style={{ color: "#d3f000" }}
              >
                View All <ArrowUpRight size={11} />
              </button>
            </div>
            <div className="divide-y divide-border">
              {stats.projectsWithDays.map((project) => {
                const daysLeft = project.daysLeft;
                return (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors hover:bg-bg-card group"
                    onClick={() => router.push(`/projects/${project.id}/kanban`)}
                  >
                    <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-bg-elevated">
                      <Zap size={12} style={{ color: "#d3f000" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <p className="text-[13px] font-semibold text-white group-hover:text-accent transition-colors truncate">
                          {project.name}
                        </p>
                        <span suppressHydrationWarning className="text-[11px] shrink-0" style={{ color: daysLeft < 0 ? "#ef4444" : "#555555" }}>
                          {daysLeft >= 0 ? `Due in ${daysLeft}d` : `${Math.abs(daysLeft)}d overdue`}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted mb-1.5">Lead: {project.lead}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${project.progress}%`, backgroundColor: "#d3f000" }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-white w-8 text-right shrink-0">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border overflow-hidden border-border bg-bg-card">
            <div className="px-5 py-3 border-b border-border" >
              <h2 className="text-xs font-black text-white uppercase tracking-widest">Recent Activity</h2>
            </div>
            <div className="divide-y divide-border-light">
              {recentActivity.map(({ user, action, target, time, dot }, i) => (
                <div key={i} className="flex gap-3 px-5 py-3.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: dot }} />
                  <div>
                    <p className="text-[12px] text-text-secondary leading-relaxed">
                      <span className="text-white font-semibold">{user}</span> {action}{" "}
                      <span className="font-semibold text-accent">{target}</span>
                    </p>
                    <p className="text-[10px] text-[#333333] mt-1">{time}</p>
                  </div>
                </div>
              ))}
              <div className="px-5 py-3">
                <button className="text-[11px] font-semibold w-full text-center transition-colors hover:opacity-80 text-accent">
                  Show All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
