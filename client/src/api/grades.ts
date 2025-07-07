import api from "@/api";
import type { Grade } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getGradeByModule(moduleId: string) {
    const response = await api.get(`v1/grades?moduleId=${moduleId}`);
    const grades: Grade[] = response.data;
    return grades;
}

export function useGetGradesByModule(moduleId: string) {
    return useQuery({
        queryKey: ["grades", moduleId],
        queryFn: () => getGradeByModule(moduleId),
        refetchOnWindowFocus: false,
    });
}

async function createGrade(data: Partial<Grade>) {
    const response: Grade = await api
        .post("/v1/grades", data)
        .then((response) => response.data);
    return response;
}

export const useCreateGrade = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGrade,
        onSuccess: (newGrade) => {
            queryClient.invalidateQueries({ queryKey: ["grades"] });

            queryClient.invalidateQueries({
                queryKey: ["grades", newGrade.moduleId],
            });
        },
    });
};

async function updateGrade(data: Partial<Grade>) {
    const response = await api.patch(`v1/grades/${data.id}`, data);

    const updatedStudySession: Grade = response.data;
    return updatedStudySession;
}

export const useUpdateGrade = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateGrade,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["grades", data.moduleId],
            });
            queryClient.setQueryData<Grade[]>(["grades"], (oldData) => {
                return (
                    oldData?.map((session) =>
                        session.id === data.id ? data : session
                    ) || []
                );
            });
        },
    });
};

export async function deleteGradeFunc(gradeId: string) {
    const response = await api.delete(`/v1/grades/${gradeId}`);
    const deletedGrade: Grade = response.data;
    return deletedGrade;
}

export const useDeleteGrade = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGradeFunc,
        onSuccess: (deleteGrade) => {
            queryClient.invalidateQueries({
                queryKey: ["grades", deleteGrade.moduleId],
            });
        },
    });
};
