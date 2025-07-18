import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import React, { Suspense } from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import SignupPage from "@/pages/auth/signup-page";
import ArchivedProjectsPage from "@/pages/archived-projects/archived-projects-page";
import SubjectPage from "@/pages/subjects/layout";
import SubjectOverview from "@/pages/subjects/overview/overview";
import SubjectProjects from "@/pages/subjects/projects/projects";
import Study from "@/pages/subjects/study/study";
import { SITE_NAME } from "@/constants";
import { ClipLoader } from "react-spinners";
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
    () => import("@/pages/grades/[subjectId]/grade-page")
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
            // { path: "login", Component: LoginPage },
            // { path: "signup", Component: SignupPage },
            { path: "tasks", Component: TasksPage },
            {
                path: "projects",
                Component: ProjectsPage,
            },
            { path: "archived-projects", Component: ArchivedProjectsPage },
            {
                path: "projects/:projectId",
                loader: async ({ params }) => {
                    if (!params?.subjectId)
                        throw new Error("Missing subjectId");
                    return params.subjectId;
                },
                Component: ProjectPage,
            },
            { path: "study", Component: TimeTrackerPage },
            {
                path: "grades",
                Component: GradesPage,
            },
            {
                path: "grades/:subjectId",
                loader: async ({ params }) => {
                    if (!params?.subjectId)
                        throw new Error("Missing subjectId");
                    return params.subjectId;
                },
                Component: GradePage,
            },
            {
                id: "subjectRouteId",
                path: "subjects/:subjectId",
                loader: async ({ params }) => {
                    if (!params.subjectId) throw new Error("Missing subjectId");
                    return params.subjectId;
                },
                Component: SubjectPage,
                children: [
                    {
                        path: "overview",
                        Component: SubjectOverview,
                    },
                    {
                        path: "projects",
                        Component: SubjectProjects,
                    },
                    {
                        path: "grades",
                        loader: async ({ params }) => {
                            if (!params?.subjectId)
                                throw new Error("Missing subjectId");
                            return params.subjectId;
                        },
                        Component: GradePage,
                    },
                    {
                        path: "study",
                        Component: Study,
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
                ],
            },
            {
                path: "logout",
                loader: () => {
                    return redirect("/login");
                },
            },
        ],
    },
    { path: "login", Component: LoginPage },
    { path: "signup", Component: SignupPage },
]);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60, // 1 min
        },
    },
});

function App() {
    // const queryClient = new QueryClient();
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <QueryClientProvider client={queryClient}>
                <Suspense
                    fallback={
                        <div className="flex flex-col h-screen justify-center items-center">
                            <div className="text-xl">
                                {" "}
                                Welcome to {SITE_NAME}
                            </div>
                            <div>Loading Application</div>
                            <ClipLoader
                                loading={true}
                                size={80}
                                color="orange"
                            />
                        </div>
                    }
                >
                    <RouterProvider router={router} />
                </Suspense>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
