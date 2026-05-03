"use client";

import { Mail, Briefcase } from "lucide-react";

interface ProfileUserCardProps {
  user: {
    name: string;
    status: string;
    role: string;
    email: string;
    department: string;
  };
  initials: string;
  statusLabel: string;
  statusStyle: { color: string; bg: string };
  statusDot: string;
  stats: {
    tasksCount: number;
    projectsCount: number;
    completionPercentage: number;
    tasksDone: number;
  };
}

export function ProfileUserCard({
  user,
  initials,
  statusLabel,
  statusStyle,
  statusDot,
  stats,
}: ProfileUserCardProps) {
  return (
    <div
      className="rounded-xl border p-6 mb-5"
      style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
    >
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-black text-xl font-black"
            style={{ backgroundColor: "#d3f000" }}
          >
            {initials}
          </div>
          <div
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
            style={{
              backgroundColor: statusDot,
              borderColor: "#1a1a1a",
            }}
          />
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-xl font-black text-white tracking-tight">{user.name}</h1>
            <span
              className="text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest"
              style={{ color: statusStyle.color, backgroundColor: statusStyle.bg }}
            >
              {statusLabel}
            </span>
          </div>
          <p className="text-[13px] text-text-muted mb-3">{user.role}</p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-[12px] text-text-muted">
              <Mail size={13} className="shrink-0" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={13} className="text-text-muted shrink-0" />
              <span className="text-[12px] text-text-muted">{user.department}</span>
            </div>
          </div>
        </div>

        {/* Resumo numérico */}
        <div className="hidden sm:flex items-center gap-6 shrink-0">
          <div className="text-center">
            <p className="text-2xl font-black text-white">{stats.tasksCount}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Tarefas</p>
          </div>
          <div className="w-px h-10" style={{ backgroundColor: "#2a2a2a" }} />
          <div className="text-center">
            <p className="text-2xl font-black text-white">{stats.projectsCount}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Projectos</p>
          </div>
          <div className="w-px h-10" style={{ backgroundColor: "#2a2a2a" }} />
          <div className="text-center">
            <p className="text-2xl font-black" style={{ color: "#d3f000" }}>{stats.completionPercentage}%</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Concluído</p>
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mt-5 pt-5 border-t" style={{ borderColor: "#2a2a2a" }}>
        <div className="flex items-center justify-between text-[10px] text-text-muted mb-2">
          <span className="uppercase tracking-wider">Progresso geral das tarefas</span>
          <span className="font-black text-white">{stats.tasksDone} de {stats.tasksCount} concluídas</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${stats.completionPercentage}%`, backgroundColor: "#d3f000" }}
          />
        </div>
      </div>
    </div>
  );
}
