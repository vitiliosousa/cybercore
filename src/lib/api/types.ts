export type ApiProjectStatus = "active" | "completed" | "paused";
export type ApiTaskStatus = "todo" | "in_progress" | "review" | "done";
export type ApiPriority =
  | "low_priority"
  | "medium_priority"
  | "high_priority"
  | "critical_priority";

export interface ApiProject {
  id: string;
  name: string;
  description?: string;
  status?: ApiProjectStatus;
  responsible?: string;
  due_date?: string;
  start_date?: string;
  members?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiTask {
  id: string;
  name: string;
  description?: string;
  status?: ApiTaskStatus;
  priority?: ApiPriority;
  assignee?: string;
  due_date?: string;
  project_id?: string;
  depends_on?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  access_token: string;
}
