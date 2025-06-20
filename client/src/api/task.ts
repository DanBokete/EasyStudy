import api from "@/api";
import type { Project, Task } from "@/types/types";
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

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTask,
        onSuccess: (newTask) => {
            queryClient.setQueryData(
                ["projects"],
                (old: Project[] | undefined) => {
                    if (!old) return [];

                    return old.map((project) => {
                        if (project.id === newTask.projectId) {
                            return {
                                ...project,
                                tasks: [...(project.tasks || []), newTask],
                            };
                        }
                        return project;
                    });
                }
            );
            // queryClient.setQueryData(
            //     ["projects", newTask.projectId],
            //     (old: Project | undefined) => {
            //         if (!old) return;

            //         return {
            //             ...old,
            //             tasks: [...(old.tasks || []), newTask],
            //         };
            //     }
            // );
            console.log(newTask);
            // queryClient.setQueryData(["tasks", newTask.id], () => newTask);
            queryClient.invalidateQueries({
                queryKey: ["projects", newTask.projectId],
            });
        },
    });
};

export async function deleteTask(id: string) {
    const response = await api.delete(`v1/tasks/${id}`);
    const project: Task = response.data;
    return project;
}

export async function deleteStudySession(data: { projectId: string }) {
    const { projectId } = data;
    const response = await api.delete(`/study-sessions/${projectId}`);
    const deletedProject: Project = response.data;
    return deletedProject;
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: (deletedTask) => {
            // queryClient.invalidateQueries({ queryKey: ["studySessions"] });
            queryClient.invalidateQueries({
                queryKey: [["projects", deletedTask.projectId]],
            });

            queryClient.invalidateQueries({ queryKey: ["projects"] });

            queryClient.setQueryData(["tasks"], (old: Task[]) =>
                old.filter((session) => session.id !== deletedTask.id)
            );

            // queryClient.invalidateQueries({
            //     queryKey: ["tasks", deletedTask.id],
            // });

            // queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};

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
            queryClient.invalidateQueries({
                queryKey: ["projects", updatedTasks[0].projectId],
            });
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};
