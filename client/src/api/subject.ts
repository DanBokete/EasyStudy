import api from "@/api";
import type { Subject, SubjectOverview } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getSubject(subjectId: string) {
    const response = await api.get(`/v1/subjects/${subjectId}`);
    const module: Subject = response.data;
    return module;
}

export function useGetSubject(subjectId: string) {
    return useQuery({
        queryKey: ["subjects", subjectId],
        queryFn: () => getSubject(subjectId),
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

async function getAllSubjects() {
    const response = await api.get(`v1/subjects`);
    const subjects: Subject[] | [] = response.data;
    return subjects;
}

export function useGetAllSubjects() {
    return useQuery({
        queryKey: ["subjects"],
        queryFn: getAllSubjects,
        refetchOnWindowFocus: false,
    });
}

// async function createSubject(data: Partial<Subject>) {
//     return api.post("/v1/subjects", data).then((response) => response.data);
// }

export const useCreateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async function (data: Partial<Subject>) {
            const response = await api.post("/v1/subjects", data);
            const newSubject: Subject = response.data;
            return newSubject;
        },
        onSuccess: (newSubject) => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });

            queryClient.setQueryData(["subjects"], (old: Subject[]) => [
                ...old,
                { ...newSubject },
            ]);
        },
    });
};
