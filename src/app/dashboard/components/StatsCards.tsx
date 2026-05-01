interface StatCardProps {
  label: string;
  value: string | number;
  badge: string;
  badgeColor: string;
}

export const StatsCards = ({ stats }: { stats: { projectosActivos: number; tarefasPendentes: number; prazosProximos: number } }) => {
  const kpis: StatCardProps[] = [
    {
      label: "Projectos Activos",
      value: stats.projectosActivos,
      badge: "+2 ESTA SEMANA",
      badgeColor: "#d3f000",
    },
    {
      label: "Tarefas Pendentes",
      value: stats.tarefasPendentes,
      badge: "-9% REDUÇÃO",
      badgeColor: "#22c55e",
    },
    {
      label: "Tarefas Concluidas",
      value: "5",
      badge: "+19% REDUÇÃO",
      badgeColor: "#d3f000",
    },
    {
      label: "Prazos Próximos",
      value: String(stats.prazosProximos).padStart(2, "0"),
      badge: `${stats.prazosProximos} URGENTE${stats.prazosProximos !== 1 ? "S" : ""}`,
      badgeColor: "#ef4444",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {kpis.map(({ label, value, badge, badgeColor }) => (
        <div
          key={label}
          className="rounded-xl border p-4 flex flex-col gap-3 bg-bg-card border-border">
          <div className="flex items-center justify-between">
            <span
              suppressHydrationWarning
              className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm uppercase"
              style={{
                color: badgeColor === "#ef4444" ? "#ef4444" : "#000",
                backgroundColor: badgeColor === "#ef4444" ? "rgba(239,68,68,0.12)" : badgeColor,
              }}
            >
              {badge}
            </span>
          </div>
          <div>
            <p suppressHydrationWarning className="text-3xl font-black text-white tracking-tight">
              {value}
            </p>
            <p className="text-[11px] text-text-muted mt-0.5 uppercase tracking-wider">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
