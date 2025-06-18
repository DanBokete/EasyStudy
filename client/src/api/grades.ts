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
