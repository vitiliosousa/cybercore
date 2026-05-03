"use client";

import { useAppStore, Task } from "@/lib/store";
import { useState, useMemo } from "react";
import { TaskDetailsModal } from "../../projects/[id]/kanban/components/TaskDetailsModal";
import { TimelineControls } from "@/components/timeline/TimelineControls";
import { TimelineSidebar } from "@/components/timeline/TimelineSidebar";
import { TimelineGantt } from "@/components/timeline/TimelineGantt";
import { startOfDay } from "@/components/timeline/utils";

export default function GlobalTimelinePage() {
  const { projects } = useAppStore();

  const allTasks = useMemo(() => 
    projects.flatMap((p) =>
      p.tasks.map((t) => ({ ...t, projectId: p.id, projectName: p.name }))
    ), [projects]
  );

  const today = startOfDay(new Date());
  const [refDate, setRefDate] = useState(today);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const navigate = (dir: "prev" | "next") => {
    const d = new Date(refDate);
    d.setMonth(d.getMonth() + (dir === "next" ? 1 : -1));
    setRefDate(startOfDay(d));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      <TimelineControls 
        refDate={refDate} 
        onNavigate={navigate} 
        onGoToToday={() => setRefDate(today)} 
      />

      <div
        className="flex-1 rounded-xl border overflow-hidden flex"
        style={{ backgroundColor: "#0d0d0d", borderColor: "#1e1e1e" }}
      >
        <TimelineSidebar 
          tasks={allTasks} 
          onTaskClick={setSelectedTask} 
          title="Todas as Tarefas" 
        />

        <TimelineGantt 
          tasks={allTasks} 
          rangeStart={rangeStart} 
          days={days} 
          today={today} 
          onTaskClick={setSelectedTask} 
        />
      </div>

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
