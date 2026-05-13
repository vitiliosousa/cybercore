import { useRouter } from "next/navigation";
import { Zap, ArrowUpRight } from "lucide-react";
import { Project } from "@/lib/store";

interface ProjectsOverviewProps {
  projects: (Project & { diasRestantes: number })[];
}

export const ProjectsOverview = ({ projects }: ProjectsOverviewProps) => {
  const router = useRouter();

  return (
    <div className="lg:col-span-2 rounded-xl border overflow-hidden bg-bg-card border-border">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h2 className="text-xs font-black text-white uppercase tracking-widest">
          Projectos Activos
        </h2>
        <button
          onClick={() => router.push("/projects")}
          className="flex items-center gap-1 text-[11px] font-semibold transition-colors hover:opacity-80 text-accent"
        >
          Ver Todos <ArrowUpRight size={11} />
        </button>
      </div>
      <div className="divide-y divide-border">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors hover:bg-bg-card group"
            onClick={() => router.push(`/projects/${project.id}/kanban`)}
          >
            <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-bg-elevated">
              <Zap size={12} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <p className="text-[13px] font-semibold text-white group-hover:text-accent transition-colors truncate">
                  {project.name}
                </p>
                <span
                  suppressHydrationWarning
                  className="text-[11px] shrink-0"
                  style={{
                    color: project.diasRestantes < 0 ? "#ef4444" : "#555555",
                  }}
                >
                  {project.diasRestantes >= 0
                    ? `${project.diasRestantes} dias restantes`
                    : `${Math.abs(project.diasRestantes)}d em atraso`}
                </span>
              </div>
              <p className="text-[10px] text-text-muted mb-1.5">
                Responsável: {project.lead}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: "#2a2a2a" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${project.progress}%`,
                      backgroundColor: "#d3f000",
                    }}
                  />
                </div>
                <span className="text-[11px] font-bold text-white w-8 text-right shrink-0">
                  {project.progress}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
