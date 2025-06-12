import api from "@/api";
import type { Project } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export async function deleteProject(projectId: string) {
    const response = await api.delete(`/projects/${projectId}`);
    const deletedProject: Project = response.data;
    return deletedProject;
}

async function updateProject(data: Partial<Project>) {
    const response = await api.patch(`/projects/${data.id}`, data);

    const updatedStudySession: Project = response.data;
    return updatedStudySession;
}

export const useUpdateProjects = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProject,
        onSuccess: (data, variables) => {
            // queryClient.invalidateQueries({
            //     queryKey: ["studySessions"],
            // });
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

export function useGetAllProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
}

// export async function useCreateStudySession(data: Partial<Project>) {
//     const response = await api.post(`/study-session`, data);
//     const project: Project = response.data;
//     return project;
// }

async function createStudySession(data: Partial<StudySession>) {
    return api.post("/study-sessions", data).then((response) => response.data);
}

export const useCreateStudySession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStudySession,
        onSuccess: (newStudySession) => {
            queryClient.invalidateQueries({ queryKey: ["studySessions"] });

            queryClient.setQueryData(
                ["studySessions"],
                (old: StudySession[]) => [...old, { ...newStudySession }]
            );
        },
    });
};

export async function deleteStudySession(data: { projectId: string }) {
    const { projectId } = data;
    const response = await api.delete(`/study-sessions/${projectId}`);
    const deletedProject: Project = response.data;
    return deletedProject;
}

export const useDeleteStudySession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteStudySession,
        onSuccess: (deletedStudySession) => {
            // queryClient.invalidateQueries({ queryKey: ["studySessions"] });

            queryClient.setQueryData(["studySessions"], (old: StudySession[]) =>
                old.filter((session) => session.id !== deletedStudySession.id)
            );
        },
    });
};
