"use client";

import { useAppStore, Task } from "@/lib/store";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { TaskDetailsModal } from "../kanban/components/TaskDetailsModal";
import { TaskTable } from "@/components/tasks/TaskTable";

export default function ProjectListPage() {
  const { projects } = useAppStore();
  const params       = useParams();
  const projectId    = params.id as string;

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const project = projects.find((p) => p.id === projectId);
  
  const tasks = useMemo(() => 
    project ? project.tasks.map(t => ({ ...t, projectId })) : [],
    [project, projectId]
  );

  if (!project) return null;

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <TaskTable 
        tasks={tasks} 
        showProject={false} 
        onViewDetails={setSelectedTask} 
      />

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
