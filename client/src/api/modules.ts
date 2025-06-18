import api from "@/api";
import type { Module } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getModule(moduleId: string) {
    const response = await api.get(`v1/modules/${moduleId}`);
    const module: Module = response.data;
    return module;
}

export function useGetModule(moduleId: string) {
    return useQuery({
        queryKey: ["modules", moduleId],
        queryFn: () => getModule(moduleId),
    });
}

async function getAllModules() {
    const response = await api.get(`v1/modules`);
    const modules: Module[] | [] = response.data;
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
