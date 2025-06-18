import api from "@/api";
import type { Grade } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

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
