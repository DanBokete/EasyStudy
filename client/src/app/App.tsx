import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import React, { Suspense } from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import SignupPage from "@/pages/auth/signup-page";
import ArchivedProjectsPage from "@/pages/archived-projects/archived-projects-page";
import ModulePage from "@/pages/module/module-page";
// import BoardPage from "./pages/board-page";
const Layout = React.lazy(() => import("../layout"));
const TasksPage = React.lazy(() => import("../pages/tasks-page"));
const DashboardPage = React.lazy(
    () => import("../pages/dashboard/dashboard-page")
);
const ProjectsPage = React.lazy(
    () => import("../pages/projects/projects-page")
);
const ProjectPage = React.lazy(
    () => import("../pages/projects/[projectId]/project-page")
);
const GradesPage = React.lazy(() => import("@/pages/grades/grades-page"));
const GradePage = React.lazy(
    () => import("@/pages/grades/[moduleId]/grade-page")
);
const TimeTrackerPage = React.lazy(
    () => import("../pages/time-tracker/time-tracker-page")
);
const LoginPage = React.lazy(() => import("../pages/auth/login-page"));

const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            { index: true, Component: DashboardPage },
            {
                path: "dashboard",
                Component: DashboardPage,
            },
            { path: "login", Component: LoginPage },
            { path: "signup", Component: SignupPage },
            { path: "tasks", Component: TasksPage },
            {
                path: "projects",
                Component: ProjectsPage,
            },
            { path: "archived-projects", Component: ArchivedProjectsPage },
            {
                path: "projects/:projectId",
                loader: async ({ params }) => {
                    if (!params?.projectId)
                        throw new Error("Missing projectId");
                    return params.projectId;
                },
                Component: ProjectPage,
            },
            { path: "study", Component: TimeTrackerPage },
            {
                path: "grades",
                Component: GradesPage,
            },
            {
                path: "grades/:moduleId",
                loader: async ({ params }) => {
                    if (!params?.moduleId) throw new Error("Missing moduleId");
                    return params.moduleId;
                },
                Component: GradePage,
            },
            {
                path: "modules/:moduleId",
                loader: async ({ params }) => {
                    if (!params?.moduleId) throw new Error("Missing moduleId");
                    return params.moduleId;
                },
                Component: ModulePage,
            },
            {
                path: "logout",
                loader: () => {
                    return redirect("/login");
                },
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
                <Suspense fallback={<div>Loading...</div>}>
                    <RouterProvider router={router} />
                </Suspense>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
