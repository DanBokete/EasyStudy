import api from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export async function logoutUser() {
    const response = await api.post("/auth/logout");
    return response.data;
}

export const useLogoutUser = () => {
    // const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            navigate("/login");
        },
    });
};
