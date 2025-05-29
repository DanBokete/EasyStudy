import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        if (window.location.pathname === "/login" && response.status === 200) {
            sessionStorage.setItem("isLoggedIn", "true");
            window.location.href = "/";
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
export default api;
