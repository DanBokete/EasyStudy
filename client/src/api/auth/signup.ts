import api from "@/api";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

type CreateUserType = {
    username: string;
    name: string;
    password: string;
    confirmPassword: string;
};

export const useCreateUser = () => {
    // const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (data: CreateUserType) => {
            try {
                const response = await api.post("/auth/signup", data);

                return response;
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    console.log(err.response?.data);
                    const message =
                        err.response?.data?.message ||
                        "Unexpected error during login";
                    throw new Error(message);
                }
                throw err;
            }
        },
        onSuccess: () => {
            navigate("/");
        },
    });
};
