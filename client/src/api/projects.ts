import api from "@/api";
import type { Project } from "@/types/types";

export async function getProject(projectId: string) {
    const response = await api.get(`/projects/${projectId}`);
    const project = response.data;
    return project;
}

export async function editProject(projectId: string, data: Partial<Project>) {
    const response = await api.patch(`/projects/${projectId}`, data);
    const project: Project = response.data;
    return project;
}

export async function getAllProjects() {
    const response = await api.get("/projects");
    const projects: Project[] | [] = response.data;
    console.log(response.data);

    return projects;
}

export async function createProject(data: Partial<Project>) {
    const response = await api.post(`/projects`, data);
    const project: Project = response.data;
    return project;
}
