"use client";

import { useAppStore, Task } from "@/lib/store";
import { useParams } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { TaskDetailsModal } from "../kanban/components/TaskDetailsModal";

// ─── Constantes ────────────────────────────────────────────────────────────────
const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const MESES_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS_SEMANA = ["D","S","T","Q","Q","S","S"];
const COL_W  = 36; // largura de cada dia em px
const ROW_H  = 44; // altura de cada linha em px

const STATUS_COLOR: Record<string, string> = {
  todo:        "#3a3a3a",
  in_progress: "#3b82f6",
  review:      "#8b5cf6",
  done:        "#d3f000",
};

const STATUS_LABEL: Record<string, string> = {
  todo:        "A Fazer",
  in_progress: "Em Progresso",
  review:      "Em Revisão",
  done:        "Concluído",
};

const PRIORITY_COLOR: Record<string, string> = {
  low:      "#22c55e",
  medium:   "#f59e0b",
  high:     "#ef4444",
  critical: "#dc2626",
};

// ─── Utilitários ───────────────────────────────────────────────────────────────
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function diffDays(a: Date, b: Date) {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({ task, onOpen }: { task: Task; onOpen: () => void }) {
  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 rounded-lg border p-3 min-w-50 pointer-events-none"
      style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}
    >
      <p className="text-[12px] font-bold text-white mb-1">{task.title}</p>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[task.status] }} />
        <span className="text-[10px] text-text-muted">{STATUS_LABEL[task.status]}</span>
        <span className="text-[10px]" style={{ color: PRIORITY_COLOR[task.priority] }}>
          · {task.priority.toUpperCase()}
        </span>
      </div>
      <p className="text-[10px] text-text-muted">Responsável: <span className="text-white">{task.assignee}</span></p>
      <p className="text-[10px] text-text-muted mt-0.5">
        {task.startDate} → {task.dueDate}
      </p>
    </div>
  );
}

// ─── Barra de tarefa (Gantt) ───────────────────────────────────────────────────
function TaskBar({
  task,
  rangeStart,
  totalDays,
  onOpen,
}: {
  task: Task;
  rangeStart: Date;
  totalDays: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const start   = startOfDay(new Date(task.startDate));
  const end     = startOfDay(new Date(task.dueDate));
  const colFrom = diffDays(rangeStart, start);
  const colTo   = diffDays(rangeStart, end);

  // Fora do intervalo visível
  if (colTo < 0 || colFrom > totalDays) return null;

  const clampedFrom = Math.max(0, colFrom);
  const clampedTo   = Math.min(totalDays - 1, colTo);
  const width       = Math.max(1, clampedTo - clampedFrom + 1);
  const isClippedL  = colFrom < 0;
  const isClippedR  = colTo >= totalDays;
  const color       = STATUS_COLOR[task.status];

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 cursor-pointer transition-all duration-150 flex items-center px-2 select-none"
      style={{
        left:   `${clampedFrom * COL_W}px`,
        width:  `${width * COL_W}px`,
        height: `${ROW_H * 0.55}px`,
        backgroundColor: color,
        borderRadius: `${isClippedL ? 0 : 6}px ${isClippedR ? 0 : 6}px ${isClippedR ? 0 : 6}px ${isClippedL ? 0 : 6}px`,
        opacity: hovered ? 1 : 0.85,
        boxShadow: hovered ? `0 0 12px ${color}55` : "none",
        zIndex: hovered ? 20 : 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      <span
        className="text-[10px] font-black truncate w-full"
        style={{ color: task.status === "done" ? "#000" : task.status === "todo" ? "#aaa" : "#fff" }}
      >
        {task.title}
      </span>
      {hovered && <Tooltip task={task} onOpen={onOpen} />}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function TimelinePage() {
  const { projects } = useAppStore();
  const params       = useParams();
  const projectId    = params?.id as string | undefined;
  const project      = projectId ? projects.find((p) => p.id === projectId) : null;

  const today = startOfDay(new Date());
  const [refDate, setRefDate]       = useState(today);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const bodyRef     = useRef<HTMLDivElement>(null);
  const taskColRef  = useRef<HTMLDivElement>(null);

  // Dias visíveis: 60 dias centrados no mês actual
  const VISIBLE_DAYS = 60;

  const rangeStart = useMemo(() => {
    const d = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
    return startOfDay(d);
  }, [refDate]);

  const days = useMemo(() => {
    return Array.from({ length: VISIBLE_DAYS }, (_, i) => {
      const d = new Date(rangeStart);
      d.setDate(rangeStart.getDate() + i);
      return d;
    });
  }, [rangeStart]);

  const todayIndex = useMemo(() => diffDays(rangeStart, today), [rangeStart, today]);

  // Sincronizar scroll horizontal entre header e body
  const syncScroll = (source: "header" | "body") => (e: React.UIEvent<HTMLDivElement>) => {
    const target = source === "header" ? bodyRef.current : headerRef.current;
    if (target) target.scrollLeft = (e.target as HTMLDivElement).scrollLeft;
  };

  // Scroll para hoje ao montar
  useEffect(() => {
    const offset = Math.max(0, todayIndex - 3) * COL_W;
    if (headerRef.current) headerRef.current.scrollLeft = offset;
    if (bodyRef.current)   bodyRef.current.scrollLeft   = offset;
  }, [todayIndex]);

  const navigate = (dir: "prev" | "next") => {
    const d = new Date(refDate);
    d.setMonth(d.getMonth() + (dir === "next" ? 1 : -1));
    setRefDate(startOfDay(d));
  };

  // Agrupar dias por mês para o cabeçalho duplo
  const monthGroups = useMemo(() => {
    const groups: { label: string; count: number }[] = [];
    let current = { label: "", count: 0 };
    days.forEach((d) => {
      const label = `${MESES[d.getMonth()]} ${d.getFullYear()}`;
      if (label !== current.label) {
        if (current.label) groups.push({ ...current });
        current = { label, count: 1 };
      } else {
        current.count++;
      }
    });
    if (current.label) groups.push(current);
    return groups;
  }, [days]);

  if (!project) return null;

  const totalW = VISIBLE_DAYS * COL_W;

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">

      {/* ── Controlos ── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 bg-[#111] border border-[#222] rounded-lg p-1">
          <button
            onClick={() => navigate("prev")}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-bg-card text-text-muted hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setRefDate(today)}
            className="px-3 py-1 text-[10px] font-black text-text-muted hover:text-white transition-colors"
          >
            Hoje
          </button>
          <div className="px-3 flex items-center gap-2 border-l border-r border-[#222]">
            <CalendarIcon size={13} className="text-accent" />
            <span className="text-[12px] font-black text-white uppercase tracking-wider min-w-44 text-center">
              {MESES_FULL[refDate.getMonth()]} {refDate.getFullYear()}
            </span>
          </div>
          <button
            onClick={() => navigate("next")}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-bg-card text-text-muted hover:text-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4">
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: STATUS_COLOR[key] }} />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Corpo principal ── */}
      <div
        className="flex-1 rounded-xl border overflow-hidden flex"
        style={{ backgroundColor: "#0d0d0d", borderColor: "#1e1e1e" }}
      >
        {/* Coluna fixa de tarefas */}
        <div
          className="w-64 shrink-0 flex flex-col border-r z-20"
          style={{ borderColor: "#1e1e1e", backgroundColor: "#0d0d0d" }}
        >
          {/* Header da coluna */}
          <div
            className="shrink-0 flex items-end px-4 border-b"
            style={{ height: "56px", borderColor: "#1e1e1e", backgroundColor: "#111" }}
          >
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] pb-2">
              Tarefas ({project.tasks.length})
            </span>
          </div>

          {/* Lista de tarefas — scroll sincronizado */}
          <div ref={taskColRef} className="flex-1 overflow-y-auto overflow-x-hidden">
            {project.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 border-b cursor-pointer hover:bg-[#151515] transition-colors"
                style={{ height: `${ROW_H}px`, borderColor: "#1a1a1a" }}
                onClick={() => setSelectedTask(task)}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLOR[task.status] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-white truncate">{task.title}</p>
                  <p className="text-[10px] text-text-muted truncate">{task.assignee}</p>
                </div>
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: PRIORITY_COLOR[task.priority] }}
                  title={task.priority}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Área de scroll horizontal */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Cabeçalho duplo: Meses + Dias */}
          <div
            ref={headerRef}
            className="shrink-0 overflow-x-auto overflow-y-hidden border-b scrollbar-none"
            style={{ borderColor: "#1e1e1e", backgroundColor: "#111" }}
            onScroll={syncScroll("header")}
          >
            <div style={{ width: `${totalW}px` }}>
              {/* Linha dos meses */}
              <div className="flex border-b" style={{ borderColor: "#1e1e1e" }}>
                {monthGroups.map(({ label, count }) => (
                  <div
                    key={label}
                    className="border-r flex items-center px-3 shrink-0"
                    style={{
                      width: `${count * COL_W}px`,
                      height: "24px",
                      borderColor: "#1e1e1e",
                    }}
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#d3f000" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Linha dos dias */}
              <div className="flex" style={{ height: "32px" }}>
                {days.map((d, i) => {
                  const isToday    = d.toDateString() === today.toDateString();
                  const isWeekend  = d.getDay() === 0 || d.getDay() === 6;
                  return (
                    <div
                      key={i}
                      className="shrink-0 border-r flex flex-col items-center justify-center"
                      style={{
                        width: `${COL_W}px`,
                        borderColor: "#1e1e1e",
                        backgroundColor: isToday ? "rgba(211,240,0,0.12)" : "transparent",
                      }}
                    >
                      <span
                        className="text-[8px] font-black"
                        style={{ color: isToday ? "#d3f000" : isWeekend ? "#444" : "#555" }}
                      >
                        {DIAS_SEMANA[d.getDay()]}
                      </span>
                      <span
                        className="text-[10px] font-black"
                        style={{ color: isToday ? "#d3f000" : isWeekend ? "#333" : "#888" }}
                      >
                        {d.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Corpo das barras Gantt */}
          <div
            ref={bodyRef}
            className="flex-1 overflow-auto"
            onScroll={syncScroll("body")}
          >
            <div style={{ width: `${totalW}px`, position: "relative" }}>
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="relative border-b"
                  style={{ height: `${ROW_H}px`, borderColor: "#1a1a1a" }}
                >
                  {/* Fundo de células */}
                  <div className="flex h-full absolute inset-0">
                    {days.map((d, i) => {
                      const isToday   = d.toDateString() === today.toDateString();
                      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                      return (
                        <div
                          key={i}
                          className="shrink-0 border-r h-full"
                          style={{
                            width: `${COL_W}px`,
                            borderColor: "#1a1a1a",
                            backgroundColor: isToday
                              ? "rgba(211,240,0,0.06)"
                              : isWeekend
                              ? "rgba(255,255,255,0.01)"
                              : "transparent",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Barra da tarefa */}
                  <TaskBar
                    task={task}
                    rangeStart={rangeStart}
                    totalDays={VISIBLE_DAYS}
                    onOpen={() => setSelectedTask(task)}
                  />
                </div>
              ))}

              {/* Linha do dia de hoje */}
              {todayIndex >= 0 && todayIndex < VISIBLE_DAYS && (
                <div
                  className="absolute top-0 bottom-0 pointer-events-none z-30"
                  style={{
                    left: `${todayIndex * COL_W + COL_W / 2}px`,
                    width: "1px",
                    backgroundColor: "#d3f000",
                    boxShadow: "0 0 6px rgba(211,240,0,0.4)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}