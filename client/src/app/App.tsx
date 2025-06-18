import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "../pages";
import Layout from "../layout";
import TasksPage from "../pages/tasks-page";
// import BoardPage from "./pages/board-page";
import ProjectsPage from "../pages/projects/projects-page";
import ProjectPage from "../pages/projects/[projectId]/project-page";
import LoginPage from "../pages/auth/login-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TimeTracker from "../pages/time-tracker/time-tracker-page";
import DashboardPage from "../pages/dashboard/dashboard-page";
import GradesPage from "@/pages/grades/grades-page";
import GradePage from "@/pages/grades/[moduleId]/grade-page";
import { ThemeProvider } from "@/components/theme-provier";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            { index: true, Component: HomePage },
            { path: "dashboard", Component: DashboardPage },
            { path: "login", Component: LoginPage },
            { path: "tasks", Component: TasksPage },
            {
                path: "projects",
                Component: ProjectsPage,
            },
            {
                path: "projects/:projectId",
                loader: async ({ params }) => {
                    if (!params?.projectId)
                        throw new Error("Missing projectId");
                    return params.projectId;
                },
                Component: ProjectPage,
            },
            { path: "study", Component: TimeTracker },
            { path: "grades", Component: GradesPage },
            {
                path: "grades/:moduleId",
                loader: async ({ params }) => {
                    if (!params?.moduleId) throw new Error("Missing moduleId");
                    return params.moduleId;
                },
                Component: GradePage,
            },
        ],
    },
]);

const queryClient = new QueryClient();

function App() {
    // const queryClient = new QueryClient();
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
