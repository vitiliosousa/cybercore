// const localhost = "http://localhost:8080/pms"
const host = "/api/proxy"        //localhost
// const host = "https://pms-alpha-0-0-1.onrender.com"


//================================================================================
//                                    METHOD: GET
//================================================================================
export const LIST_PROJECTS = `${host}/projects`
export const LIST_TASKS = `${host}/tasks`
export const LIST_PROJECT_TASKS = (project_id: string) => {
    return `${host}/tasks?project_id=${project_id}`
}
export const GET_PROJECT = (id: string) => {
    return `${host}/projects/${id}`
}
export const GET_TASK = (id: string) => {
    return `${host}/tasks/${id}`
}

//================================================================================
//                                    METHOD: PUT
//================================================================================
export const UPDATE_PROJECT_STATUS = (id: string) => {
    return `${host}/projects/${id}/status`
}
export const UPDATE_PROJECT = (id: string) => {
    return `${host}/projects/${id}`
}
export const UPDATE_TASK_STATUS = (id: string) => {
    return `${host}/tasks/${id}/status`
}
export const UPDATE_TASK = (id: string) => {
    return `${host}/tasks/${id}`
}

//================================================================================
//                                    METHOD: POST
//================================================================================
export const LOGIN_USER = `${host}/auth/login`
export const INVITE_USER = `${host}/auth/invite`
export const USER_ACCEPT_INVITE = `${host}/auth/accept-invite`
export const CREATE_PROJECT = `${host}/projects`
export const CREATE_TASK = (id: string) => {
    return `${host}/projects/${id}/tasks`
}

//================================================================================
//                                    METHOD: DELETE
//================================================================================
export const DELETE_PROJECT = (id: string) => {
    return `${host}/projects/${id}`
}
export const DELETE_TASK = (id: string) => {
    return `${host}/tasks/${id}`
}