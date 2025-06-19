import api from "@/api";
import type { User } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

async function getUser() {
    const response = await api.get(`/auth/profile`);
    const module: User = response.data;
    return module;
}

export function useGetUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => getUser(),
    });
}
