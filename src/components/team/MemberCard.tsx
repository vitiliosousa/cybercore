"use client";

import { Mail, Briefcase, CheckSquare } from "lucide-react";

interface MemberCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
    status: string;
  };
  statusDot: Record<string, string>;
  statusLabel: Record<string, string>;
  statusStyle: Record<string, { color: string; bg: string }>;
  deptColor: { bg: string; color: string };
  stats: { total: number; concluidas: number };
  projects: string[];
}

export function MemberCard({
  member,
  statusDot,
  statusLabel,
  statusStyle,
  deptColor,
  stats,
  projects,
}: MemberCardProps) {
  const ss = statusStyle[member.status];
  const progresso = stats.total > 0
    ? Math.round((stats.concluidas / stats.total) * 100)
    : 0;

  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-4 transition-all hover:border-[#3a3a3a]"
      style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
    >
      {/* Cabeçalho do card */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-black text-sm font-black"
              style={{ backgroundColor: "#d3f000" }}
            >
              {member.name.charAt(0)}
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{
                backgroundColor: statusDot[member.status],
                borderColor: "#1a1a1a",
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white truncate">{member.name}</p>
            <p className="text-[11px] text-text-muted truncate">{member.role}</p>
          </div>
        </div>
        <span
          className="text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest shrink-0"
          style={{ color: ss.color, backgroundColor: ss.bg }}
        >
          {statusLabel[member.status]}
        </span>
      </div>

      {/* Informações */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[11px] text-text-muted">
          <Mail size={11} className="shrink-0" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={11} className="text-text-muted shrink-0" />
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider"
            style={{ color: deptColor.color, backgroundColor: deptColor.bg }}
          >
            {member.department}
          </span>
        </div>
      </div>

      {/* Progresso de tarefas */}
      <div>
        <div className="flex items-center justify-between text-[10px] mb-1.5">
          <div className="flex items-center gap-1.5 text-text-muted">
            <CheckSquare size={10} />
            <span className="uppercase tracking-wider">Tarefas</span>
          </div>
          <span className="font-black text-white">
            {stats.concluidas}/{stats.total}
            <span className="text-text-muted font-normal ml-1">({progresso}%)</span>
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progresso}%`, backgroundColor: "#d3f000" }}
          />
        </div>
      </div>

      {/* Projectos */}
      {projects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {projects.slice(0, 2).map((nome) => (
            <span
              key={nome}
              className="text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider truncate max-w-30"
              style={{ backgroundColor: "#2a2a2a", color: "#666" }}
            >
              {nome}
            </span>
          ))}
          {projects.length > 2 && (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-sm"
              style={{ backgroundColor: "#2a2a2a", color: "#555" }}
            >
              +{projects.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
