import api from "@/api";
import type { Module } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getAllModules() {
    const response = await api.get(`/modules`);
    const modules: Module[] = response.data;
    return modules;
}

export function useGetAllModules() {
    return useQuery({
        queryKey: ["modules"],
        queryFn: getAllModules,
    });
}

async function createModule(data: Partial<Module>) {
    return api.post("/modules", data).then((response) => response.data);
}

export const useCreateModule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createModule,
        onSuccess: (newModule) => {
            queryClient.invalidateQueries({ queryKey: ["modules"] });

            queryClient.setQueryData(["modules"], (old: Module[]) => [
                ...old,
                { ...newModule },
            ]);
        },
    });
};
