// const localhost = "http://localhost:8080/pms"
const localhost = "/api/proxy"

//================================================================================
//                                    METHOD: GET
//================================================================================
export const LIST_PROJECTS = `${localhost}/projects`
export const LIST_TASKS = `${localhost}/tasks`
export const LIST_PROJECT_TASKS = (project_id: string) => {
    return `${localhost}/tasks?project_id=${project_id}`
}
export const GET_PROJECT = (id: string) => {
    return `${localhost}/projects/${id}`
}
export const GET_TASK = (id: string) => {
    return `${localhost}/tasks/${id}`
}

//================================================================================
//                                    METHOD: PUT
//================================================================================
export const UPDATE_PROJECT_STATUS = (id: string) => {
    return `${localhost}/projects/${id}/status`
}
export const UPDATE_PROJECT = (id: string) => {
    return `${localhost}/projects/${id}`
}
export const UPDATE_TASK_STATUS = (id: string) => {
    return `${localhost}/tasks/${id}/status`
}
export const UPDATE_TASK = (id: string) => {
    return `${localhost}/tasks/${id}`
}

//================================================================================
//                                    METHOD: POST
//================================================================================
export const CREATE_PROJECT = `${localhost}/projects`
export const CREATE_TASK = (id: string) => {
    return `${localhost}/projects/${id}/tasks`
}

//================================================================================
//                                    METHOD: DELETE
//================================================================================
export const DELETE_PROJECT = (id: string) => {
    return `${localhost}/projects/${id}`
}
export const DELETE_TASK = (id: string) => {
    return `${localhost}/tasks/${id}`
}