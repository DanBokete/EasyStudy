import api from "@/api";
import type { Task } from "@/types/types";

export function getTasks() {}

export async function editTask(taskId: string, data: Partial<Task>) {
    const response = await api.patch(`/tasks/${taskId}`, data);
    const task: Task = response.data;
    return task;
}

export async function createTask(data: Partial<Task>) {
    console.log(data);

    const response = await api.post(`/tasks`, data);
    const project: Task = response.data;

    return project;
}
