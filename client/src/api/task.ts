import api from "@/api";
import type { Task } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

async function updateManyTasksFn(data: Partial<Task>[]) {
    console.log(data);

    const response = await api.patch(`v1/tasks/bulk`, data);
    const tasks: Task[] = response.data;
    return tasks;
}

export const useUpdateManyTasks = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateManyTasksFn,
        onSuccess: (updatedTasks) => {
            queryClient.setQueryData<Task[]>(["projects"], (oldTasks = []) => {
                return oldTasks.map((task) => {
                    const updated = updatedTasks.find((t) => t.id === task.id);
                    return updated ? { ...task, ...updated } : task;
                });
            });
        },
    });
};
