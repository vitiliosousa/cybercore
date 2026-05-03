"use client";

import { useRef, useEffect, useMemo } from "react";
import { Task } from "@/lib/store";
import { TaskBar } from "./TaskBar";
import { COL_W, ROW_H, DIAS_SEMANA, MESES, startOfDay, diffDays } from "./utils";

interface TimelineGanttProps {
  tasks: (Task & { projectName?: string })[];
  rangeStart: Date;
  days: Date[];
  today: Date;
  onTaskClick: (task: Task) => void;
}

export function TimelineGantt({
  tasks,
  rangeStart,
  days,
  today,
  onTaskClick,
}: TimelineGanttProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const totalW = days.length * COL_W;
  const todayIndex = diffDays(rangeStart, today);

  // Sincronizar scroll horizontal
  const syncScroll = (source: "header" | "body") => (e: React.UIEvent<HTMLDivElement>) => {
    const target = source === "header" ? bodyRef.current : headerRef.current;
    if (target) target.scrollLeft = (e.target as HTMLDivElement).scrollLeft;
  };

  // Scroll para hoje ao montar ou mudar range
  useEffect(() => {
    const offset = Math.max(0, todayIndex - 3) * COL_W;
    if (headerRef.current) headerRef.current.scrollLeft = offset;
    if (bodyRef.current) bodyRef.current.scrollLeft = offset;
  }, [todayIndex, rangeStart]);

  // Agrupar dias por mês
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

  return (
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
          {tasks.map((task, idx) => (
            <div
              key={`${task.id}-${idx}`}
              className="relative border-b hover:z-40"
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
                totalDays={days.length}
                onOpen={() => onTaskClick(task)}
              />
            </div>
          ))}

          {/* Linha do dia de hoje */}
          {todayIndex >= 0 && todayIndex < days.length && (
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
  );
}
