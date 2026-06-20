import type { Project, Task, TaskPriority, TaskStatus } from "@/lib/store";
import type {
  ApiPriority,
  ApiProject,
  ApiProjectStatus,
  ApiTask,
  ApiTaskStatus,
} from "./types";

const PRIORITY_TO_API: Record<TaskPriority, ApiPriority> = {
  low: "low_priority",
  medium: "medium_priority",
  high: "high_priority",
  critical: "critical_priority",
};

const PRIORITY_FROM_API: Record<ApiPriority, TaskPriority> = {
  low_priority: "low",
  medium_priority: "medium",
  high_priority: "high",
  critical_priority: "critical",
};

const PROJECT_STATUS_TO_API: Record<
  Project["status"],
  ApiProjectStatus
> = {
  active: "active",
  on_hold: "paused",
  completed: "completed",
};

const PROJECT_STATUS_FROM_API: Record<
  ApiProjectStatus,
  Project["status"]
> = {
  active: "active",
  paused: "on_hold",
  completed: "completed",
};

export function toDateOnly(value?: string): string {
  if (!value) return "";
  return value.slice(0, 10);
}

export function mapTaskFromApi(task: ApiTask): Task {
  const startDate =
    toDateOnly(task.created_at) || toDateOnly(task.updated_at) || toDateOnly(task.due_date);

  return {
    id: task.id,
    title: task.name,
    description: task.description ?? "",
    status: (task.status ?? "todo") as TaskStatus,
    priority: task.priority
      ? PRIORITY_FROM_API[task.priority]
      : "medium",
    assignee: task.assignee ?? "",
    startDate,
    dueDate: toDateOnly(task.due_date),
    tags: [],
  };
}

export function mapProjectFromApi(
  project: ApiProject,
  tasks: Task[] = [],
): Project {
  const done = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return {
    id: project.id,
    name: project.name,
    description: project.description ?? "",
    status: project.status
      ? PROJECT_STATUS_FROM_API[project.status]
      : "active",
    lead: project.responsible ?? "",
    dueDate: toDateOnly(project.due_date),
    progress,
    tasks,
    members: project.members ?? [],
  };
}

export function mapCreateProjectBody(data: {
  name: string;
  description: string;
  lead: string;
  dueDate: string;
  startDate?: string;
  members: string[];
}) {
  return {
    name: data.name,
    description: data.description,
    responsible: data.lead,
    due_date: data.dueDate,
    start_date: data.startDate || data.dueDate,
    members: data.members,
  };
}

export function mapCreateTaskBody(data: {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
}) {
  return {
    name: data.title,
    description: data.description,
    status: data.status,
    priority: PRIORITY_TO_API[data.priority],
    assignee: data.assignee,
    due_date: data.dueDate,
  };
}

export function mapUpdateTaskStatusBody(status: TaskStatus) {
  return { status };
}

export { PRIORITY_TO_API, PROJECT_STATUS_TO_API };
