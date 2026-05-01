"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Search, Mail, Briefcase } from "lucide-react";

const statusDot = { active: "#d3f000", away: "#f59e0b", offline: "#333333" };
const statusLabel = { active: "ACTIVE", away: "AWAY", offline: "OFFLINE" };
const statusStyle: Record<string, { color: string; bg: string }> = {
  active: { color: "#d3f000", bg: "rgba(211,240,0,0.1)" },
  away: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  offline: { color: "#555555", bg: "rgba(85,85,85,0.1)" },
};
const deptColors = [
  "rgba(59,130,246,0.15)",
  "rgba(139,92,246,0.15)",
  "rgba(236,72,153,0.15)",
  "rgba(249,115,22,0.15)",
];
const deptText = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316"];

export default function TeamPage() {
  const { isAuthenticated, isInitialized, teamMembers } = useAppStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");

  useEffect(() => {
    if (isInitialized && !isAuthenticated) router.push("/login");
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || !isAuthenticated) return null;

  const departments = [
    "all",
    ...Array.from(new Set(teamMembers.map((m) => m.department))),
  ];
  const deptColorMap = Object.fromEntries(
    departments.slice(1).map((d, i) => [
      d,
      {
        bg: deptColors[i % deptColors.length],
        color: deptText[i % deptText.length],
      },
    ]),
  );

  const filtered = teamMembers.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "all" || m.department === filterDept;
    return matchSearch && matchDept;
  });

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Equipa
          </h1>
        </div>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 max-w-xs"
            style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
          >
            <Search size={13} className="text-text-muted" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-white placeholder:text-text-muted outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className="flex rounded-lg border overflow-hidden"
              style={{ borderColor: "#2a2a2a" }}
            >
              {departments.map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDept(d)}
                  className="px-3 py-2 text-[11px] font-black tracking-wider transition-colors capitalize"
                  style={
                    filterDept === d
                      ? { backgroundColor: "#d3f000", color: "#000" }
                      : { backgroundColor: "#1a1a1a", color: "#555555" }
                  }
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              id="invite-member-btn"
              className="flex items-center gap-2 text-[12px] font-black text-black px-4 py-2 rounded-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: "#d3f000" }}
            >
              <Plus size={13} className="text-black" /> Invite Member
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((member) => {
            const ss = statusStyle[member.status];
            const dc = deptColorMap[member.department] ?? {
              bg: "rgba(85,85,85,0.1)",
              color: "#555555",
            };
            return (
              <div
                key={member.id}
                className="rounded-xl border p-5 flex flex-col gap-4 hover:border-[#3a3a3a] transition-all"
                style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-black text-sm font-black"
                        style={{ backgroundColor: "#d3f000" }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-card"
                        style={{ backgroundColor: statusDot[member.status] }}
                      />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-white">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest"
                    style={{ color: ss.color, backgroundColor: ss.bg }}
                  >
                    {statusLabel[member.status]}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-text-muted">
                    <Mail size={11} />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={11} className="text-text-muted" />
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider"
                      style={{ color: dc.color, backgroundColor: dc.bg }}
                    >
                      {member.department}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="pt-3 border-t flex items-center justify-between"
                  style={{ borderColor: "#2a2a2a" }}
                >
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">
                      Active Tasks
                    </p>
                    <p className="text-lg font-black text-white">
                      {member.activeTasks}
                    </p>
                  </div>
                  <button
                    className="text-[11px] font-semibold transition-colors hover:opacity-80"
                    style={{ color: "#d3f000" }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
