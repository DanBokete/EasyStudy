import api from "@/api";
import type { Project } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// todo
// use updated pattern for projects page

export async function getProject(projectId: string) {
    const response = await api.get(`v1/projects/${projectId}`);
    const project: Project = response.data;
    return project;
}

export async function editProject(projectId: string, data: Partial<Project>) {
    const response = await api.patch(`v1/projects/${projectId}`, data);
    const project: Project = response.data;
    return project;
}

export async function getAllProjects() {
    const response = await api.get("v1/projects");
    const projects: Project[] = response.data;
    console.log(response.data);

    return projects;
}

export async function createProject(data: Partial<Project>) {
    const response = await api.post(`v1/projects`, data);
    const project: Project = response.data;
    return project;
}

export async function deleteProject(projectId: string) {
    const response = await api.delete(`v1/projects/${projectId}`);
    const deletedProject: Project = response.data;
    return deletedProject;
}

async function updateProject(data: Partial<Project>) {
    const response = await api.patch(`v1/projects/${data.id}`, data);

    const updatedStudySession: Project = response.data;
    return updatedStudySession;
}

export const useUpdateProjects = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProject,
        onSuccess: (data) => {
            // queryClient.invalidateQueries({
            //     queryKey: ["studySessions"],
            // });
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.setQueryData<Project[]>(["projects"], (oldData) => {
                return (
                    oldData?.map((session) =>
                        session.id === data.id ? data : session
                    ) || []
                );
            });
        },
    });
};

export function useGetProject(projectId: string) {
    return useQuery({
        queryKey: ["projects", projectId],
        queryFn: () => getProject(projectId),
    });
}
export function useGetAllProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
}

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: (newProject) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({
                queryKey: ["projects", newProject.id],
            });

            // queryClient.setQueryData(["projects"], (old: Project[]) => [
            //     ...old,
            //     { ...newProject },
            // ]);

            // queryClient.setQueryData(
            //     ["projects", newProject.id],
            //     () => newProject
            // );
        },
    });
};

export async function deleteProjectFunc(projectId: string) {
    const response = await api.delete(`/v1/projects/${projectId}`);
    const deletedProject: Project = response.data;
    return deletedProject;
}

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProjectFunc,
        onSuccess: (deletedProject) => {
            // queryClient.invalidateQueries({ queryKey: ["studySessions"] });

            queryClient.setQueryData(["projects"], (old: Project[]) =>
                old.filter((project) => project.id !== deletedProject.id)
            );
        },
    });
};
