import axios from "axios";
const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            try {
                const response = await axios.post(
                    `/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                if (
                    response.status !== 401 &&
                    window.location.pathname !== "/login"
                )
                    return api(error.config);
                return (window.location.pathname = "/login");
            } catch (err) {
                console.log("error", err);
                return (window.location.pathname = "/login");
            }
        }
        return Promise.reject(error);
    }
);
export default api;
