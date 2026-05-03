"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { MemberCard } from "@/components/team/MemberCard";

// ─── Mapas de estilo ───────────────────────────────────────────────────────────
const statusDot: Record<string, string> = {
  active:  "#d3f000",
  away:    "#f59e0b",
  offline: "#333333",
};

const statusLabel: Record<string, string> = {
  active:  "Activo",
  away:    "Ausente",
  offline: "Offline",
};

const statusStyle: Record<string, { color: string; bg: string }> = {
  active:  { color: "#d3f000", bg: "rgba(211,240,0,0.1)"  },
  away:    { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  offline: { color: "#555555", bg: "rgba(85,85,85,0.1)"   },
};

const deptColors = [
  { bg: "rgba(59,130,246,0.15)",  color: "#3b82f6" },
  { bg: "rgba(139,92,246,0.15)",  color: "#8b5cf6" },
  { bg: "rgba(236,72,153,0.15)",  color: "#ec4899" },
  { bg: "rgba(249,115,22,0.15)",  color: "#f97316" },
];

export default function TeamPage() {
  const { isAuthenticated, isInitialized, teamMembers, projects } = useAppStore();
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isInitialized && !isAuthenticated) router.push("/login");
  }, [isInitialized, isAuthenticated, router]);

  const departments = useMemo(() => 
    Array.from(new Set(teamMembers.map((m) => m.department))),
    [teamMembers]
  );

  const deptColorMap = useMemo(() => 
    Object.fromEntries(
      departments.map((d, i) => [d, deptColors[i % deptColors.length]])
    ), [departments]
  );

  const statsByMember = useMemo(() => 
    Object.fromEntries(
      teamMembers.map((m) => {
        const tarefas = projects.flatMap((p) =>
          p.tasks.filter((t) => t.assignee === m.name)
        );
        const concluidas = tarefas.filter((t) => t.status === "done").length;
        return [m.id, { total: tarefas.length, concluidas }];
      })
    ), [teamMembers, projects]
  );

  const projectsByMember = useMemo(() => 
    Object.fromEntries(
      teamMembers.map((m) => [
        m.id,
        projects.filter((p) => p.members.includes(m.name)).map((p) => p.name),
      ])
    ), [teamMembers, projects]
  );

  const filtered = useMemo(() => 
    teamMembers.filter((m) => 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase())
    ), [teamMembers, search]
  );

  if (!isInitialized || !isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl uppercase font-black text-white tracking-tight">Equipa</h1>
          <p className="text-[11px] text-text-muted mt-0.5">
            {teamMembers.length} membros no total
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 max-w-xs"
            style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
          >
            <Search size={13} className="text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Pesquisar membros..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-white placeholder:text-text-muted outline-none w-full"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-text-muted hover:text-white transition-colors text-[11px]"
              >✕</button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#1a1a1a" }}>
              <Search size={20} className="text-text-muted" />
            </div>
            <p className="text-white font-semibold text-sm mb-1">Nenhum membro encontrado</p>
            <p className="text-text-muted text-[12px]">Tente ajustar os filtros de pesquisa</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                statusDot={statusDot}
                statusLabel={statusLabel}
                statusStyle={statusStyle}
                deptColor={deptColorMap[member.department] ?? { bg: "rgba(85,85,85,0.1)", color: "#555555" }}
                stats={statsByMember[member.id]}
                projects={projectsByMember[member.id]}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
