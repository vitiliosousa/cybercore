"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore, Project } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Plus, Search, MoreHorizontal, ArrowUpRight } from "lucide-react";

const statusLabel: Record<string, string> = {
  active: "ACTIVE",
  on_hold: "ON HOLD",
  completed: "COMPLETED",
};

const statusStyle: Record<string, { color: string; bg: string }> = {
  active: { color: "#d3f000", bg: "rgba(211,240,0,0.1)" },
  on_hold: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  completed: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
};

type ProjectWithDays = Project & { daysLeft: number };

export default function ProjectsPage() {
  const { isAuthenticated, projects } = useAppStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "on_hold" | "completed">("all");
  const [isMounted, setIsMounted] = useState(false);
  const [projectsWithDays, setProjectsWithDays] = useState<ProjectWithDays[]>([]);

  useEffect(() => {
    setIsMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || p.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  useEffect(() => {
    if (!isMounted) return;
    const now = Date.now();
    const withDays = filtered.map(p => ({
      ...p,
      daysLeft: Math.ceil((new Date(p.dueDate).getTime() - now) / 86400000)
    }));
    setProjectsWithDays(withDays); // eslint-disable-line react-hooks/set-state-in-effect
  }, [isMounted, filtered]);

  if (!isAuthenticated || !isMounted) return null;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">Project Portfolio</h1>
            <p className="text-[11px] text-[#555555] mt-0.5">{filtered.length} projects found</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 border" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
              <Search size={13} className="text-[#555555] shrink-0" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[13px] text-white placeholder:text-[#555555] outline-none w-36"
              />
            </div>

            {/* Filter */}
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: "#2a2a2a" }}>
              {(["all", "active", "on_hold", "completed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors"
                  style={
                    filter === s
                      ? { backgroundColor: "#d3f000", color: "#000" }
                      : { backgroundColor: "#1a1a1a", color: "#555555" }
                  }
                >
                  {s === "all" ? "All" : s === "on_hold" ? "On Hold" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <button
              id="create-project-btn"
              onClick={() => router.push("/projects/create")}
              className="flex items-center gap-2 text-[12px] font-black text-black px-4 py-2 rounded-lg transition-all hover:opacity-90"
              style={{ backgroundColor: "#d3f000" }}
            >
              <Plus size={13} className="text-black" />
              New Project
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {projectsWithDays.map((project) => {
            const daysLeft = project.daysLeft;
            const doneTasks = project.tasks.filter((t) => t.status === "done").length;
            const s = statusStyle[project.status];
            return (
              <div
                key={project.id}
                className="rounded-xl border flex flex-col gap-4 p-5 cursor-pointer transition-all hover:border-[#3a3a3a] group"
                style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
                onClick={() => router.push(`/projects/${project.id}/kanban`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-[9px] font-black tracking-[0.15em] px-2 py-0.5 rounded-sm mb-2 uppercase"
                      style={{ color: s.color, backgroundColor: s.bg }}
                    >
                      {statusLabel[project.status]}
                    </span>
                    <h3 className="text-[14px] font-bold text-white leading-snug group-hover:text-[#d3f000] transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-[11px] text-[#555555] mt-1 line-clamp-2">{project.description}</p>
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-md hover:bg-[#2a2a2a] transition-colors shrink-0"
                  >
                    <MoreHorizontal size={14} className="text-[#555555]" />
                  </button>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[#555555] mb-1.5">
                    <span className="uppercase tracking-wider">Progress</span>
                    <span className="font-black text-white">{project.progress}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${project.progress}%`, backgroundColor: "#d3f000" }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-[11px] text-[#555555] pt-2 border-t" style={{ borderColor: "#2a2a2a" }}>
                  <span>
                    Lead: <span className="text-[#8f8f8f] font-medium">{project.lead}</span>
                  </span>
                  <span>{doneTasks}/{project.tasks.length} tasks</span>
                  <span suppressHydrationWarning style={{ color: daysLeft < 0 ? "#ef4444" : "#555555" }}>
                    {daysLeft >= 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d late`}
                  </span>
                </div>

                {/* Members + Open */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {project.members.slice(0, 3).map((m, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-black text-black"
                        style={{ backgroundColor: "#d3f000", borderColor: "#1a1a1a" }}
                        title={m}
                      >
                        {m.charAt(0)}
                      </div>
                    ))}
                    {project.members.length > 3 && (
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-[#555555]" style={{ backgroundColor: "#2a2a2a", borderColor: "#1a1a1a" }}>
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                  <button
                    className="flex items-center gap-1 text-[11px] font-semibold transition-colors hover:opacity-80"
                    style={{ color: "#d3f000" }}
                    onClick={(e) => { e.stopPropagation(); router.push(`/projects/${project.id}/kanban`); }}
                  >
                    Open <ArrowUpRight size={11} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* New project card */}
          <div
            onClick={() => router.push("/projects/create")}
            className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 p-8 cursor-pointer transition-all hover:border-[#d3f000]/40 group min-h-[220px]"
            style={{ borderColor: "#2a2a2a" }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: "#2a2a2a" }}>
              <Plus size={18} className="text-[#555555] group-hover:text-[#d3f000] transition-colors" />
            </div>
            <p className="text-[12px] font-semibold text-[#555555] group-hover:text-[#d3f000] transition-colors">
              Create new project
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
