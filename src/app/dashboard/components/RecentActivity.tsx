const actividadeRecente = [
  { user: "David Chen", action: "concluiu 4 tarefas em", target: "Alpha Sprint", time: "há 2 minutos", dot: "#d3f000" },
  { user: "Sistema", action: "atribuiu automaticamente 12 issues à", target: "Equipa UI/UX", time: "há 14 minutos", dot: "#3b82f6" },
  { user: "Sarah Jenkins", action: "carregou 3 novos assets em", target: "Projecto Quantum", time: "há 1 hora", dot: "#8b5cf6" },
  { user: "Aviso", action: "Prazo a aproximar-se para", target: "Auditoria de Segurança", time: "há 3 horas", dot: "#f59e0b" },
];

export const RecentActivity = () => {
  return (
    <div className="rounded-xl border overflow-hidden border-border bg-bg-card">
      <div className="px-5 py-3 border-b border-border">
        <h2 className="text-xs font-black text-white uppercase tracking-widest">
          Actividade Recente
        </h2>
      </div>
      <div className="divide-y divide-border-light">
        {actividadeRecente.map(({ user, action, target, time, dot }, i) => (
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
            Ver Toda a Actividade
          </button>
        </div>
      </div>
    </div>
  );
};
