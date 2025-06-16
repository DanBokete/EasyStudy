import api from "@/api";
import type { Task } from "@/types/types";

export function getTasks() {}

export async function editTask(taskId: string, data: Partial<Task>) {
    const response = await api.patch(`v1/tasks/${taskId}`, data);
    const task: Task = response.data;
    return task;
}

export async function createTask(data: Partial<Task>) {
    console.log(data);

    const response = await api.post(`v1/tasks`, data);
    const project: Task = response.data;

    return project;
}

export async function deleteTask(id: string) {
    const response = await api.delete(`v1/tasks/${id}`);
    const project: Task = response.data;
    return project;
}
