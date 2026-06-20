import type { ApiProject, ApiTask, LoginResponse } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/pms/v1";

const TOKEN_KEY = "cybercore_token";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json();
      message = body.error ?? body.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  login(email: string, password: string) {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  listProjects() {
    return request<ApiProject[]>("/projects");
  },

  getProject(id: string) {
    return request<ApiProject>(`/projects/${id}`);
  },

  createProject(body: Record<string, unknown>) {
    return request<ApiProject>("/projects", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  deleteProject(id: string) {
    return request<{ message?: string }>(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  listTasks(params?: { project_id?: string }) {
    const query = params?.project_id
      ? `?project_id=${encodeURIComponent(params.project_id)}`
      : "";
    return request<ApiTask[]>(`/tasks${query}`);
  },

  createTask(projectId: string, body: Record<string, unknown>) {
    return request<ApiTask>(`/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  updateTaskStatus(taskId: string, status: string) {
    return request<ApiTask>(`/tasks/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  updateTask(taskId: string, body: Record<string, unknown>) {
    return request<ApiTask>(`/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  deleteTask(taskId: string) {
    return request<{ message?: string }>(`/tasks/${taskId}`, {
      method: "DELETE",
    });
  },
};
