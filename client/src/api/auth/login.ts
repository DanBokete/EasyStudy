import api from "@/api";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

type LoginUserType = {
    username: string;
    password: string;
};

export async function loginUser(data: LoginUserType) {
    try {
        const response = await api.post("/auth/login", data);
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const message =
                err.response?.data?.message || "Unexpected error during login";
            throw new Error(message);
        }
        throw err;
    }
}

export const useLoginUser = () => {
    // const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            navigate("/");
        },
    });
};
