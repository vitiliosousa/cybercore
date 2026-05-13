import { Task, TaskPriority, TaskStatus } from "@/lib/store";
import universalRequest from "../universalRequest";
import { GET_TASK, CREATE_TASK, LIST_TASKS, LIST_PROJECT_TASKS, UPDATE_TASK, UPDATE_TASK_STATUS } from "../urls";

export interface ApiTask {
  id: string;
  name: string;
  description: string;
  assignee: string;
  project_id: string;
  depends_on: string;
  priority: "low_priority" | "medium_priority" | "high_priority";
  status: "todo" | "in_progress" | "done";
  due_date: string;
  last_accessed_at: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_by: string;
}

//formatting date coming from backend
const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const mapApiTaskToFrontend = (api: ApiTask): Task => ({
  id: api.id,
  title: api.name,
  description: api.description,
  status: api.status as TaskStatus,
  priority: api.priority as TaskPriority,
  assignee: api.assignee,
  startDate: api.created_at,  // ApiTask has no start_date — using created_at as closest match
  dueDate: formatTimestamp(api.due_date),
  tags: [],                   // ApiTask has no tags field — default to empty array
})

export interface CreateTaskRequest {
  name: string;
  assignee: string;
  description: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface UpdateStatusRequest {
  status: string;
}

export interface GetTasksFilters {
    project_id?: string;
    status?: TaskStatus;
    priority?: TaskPriority
    assignee?: string;
    page?: number;
    limit?: number
}


export async function updateTask(id: string, body: CreateTaskRequest): Promise<Task | null> {
    try{
        const response = await universalRequest<CreateTaskRequest, ApiTask>(
            `${UPDATE_TASK(id)}`, 
            "PUT", 
            { body }
        );
        console.log("Raw API response: ", response)
        
        return response ? mapApiTaskToFrontend(response) : null;
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
    
}

export async function updateTaskStatus(id: string, body: UpdateStatusRequest): Promise<Task | null> {
    try{
        const response = await universalRequest<UpdateStatusRequest, ApiTask>(
            `${UPDATE_TASK(id)}`, 
            "PUT", 
            { body }
        );
        console.log("Raw API response: ", response)
        
        return response ? mapApiTaskToFrontend(response) : null;
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
    
}

export async function createTask(project_id: string, body: CreateTaskRequest): Promise<Task | null> {
    try{
        const response = await universalRequest<CreateTaskRequest, ApiTask>(
            `${CREATE_TASK(project_id)}`, 
            "POST", 
            { body }
        );
        console.log("Raw API response: ", response)
        
        return response ? mapApiTaskToFrontend(response) : null;
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
}

export const fetchTask = async(id: string): Promise<Task | null> => {
    try {
        const response = await universalRequest<undefined, ApiTask>(
            `${GET_TASK(id)}`,
            "GET"
        )
        console.log("Raw API response: ", response)

        if(!response) {
            throw new Error('Task not found')
        }

        return response ? mapApiTaskToFrontend(response) : null;
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
}

export const fetchTasks = async(filters?: GetTasksFilters): Promise<ApiTask[] | null> => {
    try {
        const url = new URL(`${window.location.origin}${LIST_TASKS}`);

        //or, safer for SSR:
        const queryString = filters
            ? "?" + new URLSearchParams(
                Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v !== undefined)
                )
            ).toString()
            : "";
        const response = await universalRequest<undefined, ApiTask[]>(
            `${LIST_TASKS}${queryString}`,
            "GET"
        )
        console.log("Request URL: ", `${LIST_TASKS}${queryString}`)
        console.log("Raw API response: ", response)

        if(!response) {
            throw new Error('Task not found')
        }

        return response
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
}

/*
// no filters — fetch all
const all = await getTasks();

// with filters
const filtered = await getProjects({ status: "active", responsible: "Ciclano" });

// pre-mapped
const projects = filtered ? filtered.map(mapApiProjectToFrontend) : [];
*/