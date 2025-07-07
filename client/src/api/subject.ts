import api from "@/api";
import type { Module, SubjectOverview } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getModule(moduleId: string) {
    const response = await api.get(`/v1/subjects/${moduleId}`);
    const module: Module = response.data;
    return module;
}

export function useGetModule(subjectId: string) {
    return useQuery({
        queryKey: ["subjects", subjectId],
        queryFn: () => getModule(subjectId),
        refetchOnWindowFocus: false,
    });
}
export function useSubjectOverview(subjectId: string) {
    return useQuery({
        queryKey: ["subjects", "overview", subjectId],
        queryFn: async () => {
            const response = await api.get(
                `/v1/subjects/overview/${subjectId}`
            );
            const subjectOverview: SubjectOverview = response.data;
            return subjectOverview;
        },
        refetchOnWindowFocus: false,
    });
}

async function getAllModules() {
    const response = await api.get(`v1/subjects`);
    const subjects: Module[] | [] = response.data;
    return subjects;
}

export function useGetAllSubjects() {
    return useQuery({
        queryKey: ["subjects"],
        queryFn: getAllModules,
        refetchOnWindowFocus: false,
    });
}

// async function createModule(data: Partial<Module>) {
//     return api.post("/v1/subjects", data).then((response) => response.data);
// }

export const useCreateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async function (data: Partial<Module>) {
            const response = await api.post("/v1/subjects", data);
            const newSubject: Module = response.data;
            return newSubject;
        },
        onSuccess: (newModule) => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });

            queryClient.setQueryData(["subjects"], (old: Module[]) => [
                ...old,
                { ...newModule },
            ]);
        },
    });
};
