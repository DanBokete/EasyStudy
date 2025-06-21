import api from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

type CreateUserType = {
    username: string;
    name: string;
    password: string;
    confirmPassword: string;
};

async function createUser(data: CreateUserType) {
    return api.post("/auth/signup", data).then((response) => response.data);
}

export const useCreateUser = () => {
    // const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            navigate("/");
        },
    });
};
