import { Project } from "@/lib/store";
import universalRequest from "../universalRequest";
import { GET_PROJECT, CREATE_PROJECT, LIST_PROJECTS, UPDATE_PROJECT, UPDATE_PROJECT_STATUS } from "../urls";
import { useState } from "react";
import { error } from "console";

interface ApiProject {
    created_at: string;
    created_by: string;
    deleted_by: string;
    description: string;
    due_date: string;
    id: string;
    last_accessed_at: string;
    members: string[];
    name: string;
    responsible: string;
    start_date: string;
    status: string;
    updated_at: string;
    updated_by: string; 
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

const capitalizeFirstLetter = (str: string) => 
    str.charAt(0).toUpperCase() + str.slice(1);

export const mapApiProjectToFrontend = (api: ApiProject): Project => ({
  id: api.id,
  name: capitalizeFirstLetter(api.name),
  description: api.description,
  status: api.status as "active" | "on_hold" | "completed",
  lead: api.responsible,
  dueDate: formatTimestamp(api.due_date),
  progress: 0, // ApiProject has no progress field — compute or default
  tasks: [],   // ApiProject has no tasks field — fetch separately if needed
  members: api.members,
})

export interface CreateProjectRequest {
  name: string;
  description: string;
  due_date: string;
  start_date?: string;
  responsible: string;
  members: string[];
}

export interface UpdateStatusRequest {
  status: string;
}

export interface GetProjectsFilters {
    status?: "active" | "completed" | "paused";
    assignee?: string;
    sort?: string;
}

interface ListProjectsResponse {
    data: ApiProject[];
    meta: {
        limit: number;
        page: number;
    }
}

export async function updateProject(id: string, body: CreateProjectRequest): Promise<Project | null> {
    try{
        const response = await universalRequest<CreateProjectRequest, ApiProject>(
            `${UPDATE_PROJECT(id)}`, 
            "PUT", 
            { body }
        );
        console.log("Raw API response: ", response)
        
        return response ? mapApiProjectToFrontend(response) : null;
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
    
}

export async function updateProjectStatus(id: string, body: UpdateStatusRequest): Promise<Project | null> {
    try{
        const response = await universalRequest<UpdateStatusRequest, ApiProject>(
            `${UPDATE_PROJECT(id)}`, 
            "PUT", 
            { body }
        );
        console.log("Raw API response: ", response)
        
        return response ? mapApiProjectToFrontend(response) : null;
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
    
}

export async function createProject(body: CreateProjectRequest): Promise<Project | null> {
    try{
        const response = await universalRequest<CreateProjectRequest, ApiProject>(
            CREATE_PROJECT, 
            "POST", 
            { body }
        );
        console.log("Raw API response: ", response)
        
        return response ? mapApiProjectToFrontend(response) : null;
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
}

export const fetchProject = async(id: string): Promise<Project | null> => {
    try {
        const response = await universalRequest<undefined, ApiProject>(
            `${GET_PROJECT(id)}`,
            "GET"
        )
        console.log("Raw API response: ", response)

        if(!response) {
            throw new Error('Project not found')
        }

        return response ? mapApiProjectToFrontend(response) : null;
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
}

export const fetchProjects = async(): Promise<ApiProject[] | null> => {
    try {
        const response = await universalRequest<undefined, ListProjectsResponse>(
            LIST_PROJECTS,
            "GET"
        )
        console.log("Raw API response: ", response)

        if(!response) {
            throw new Error('Project not found')
        }

        return response.data
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
}

/*
// no filters — fetch all
const all = await getProjects();

// with filters
const filtered = await getProjects({ status: "active", responsible: "Ciclano" });

// pre-mapped
const projects = filtered ? filtered.map(mapApiProjectToFrontend) : [];
*/