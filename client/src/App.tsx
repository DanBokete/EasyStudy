import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages";
import Layout from "./layout";
import TasksPage from "./pages/tasks-page";
// import BoardPage from "./pages/board-page";
import ProjectsPage from "./pages/projects/projects-page";
import { getProject } from "./api/projects";
import ProjectPage from "./pages/projects/[projectId]/project-page";
import LoginPage from "./pages/auth/login-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            { index: true, Component: HomePage },
            { path: "login", Component: LoginPage },
            { path: "tasks", Component: TasksPage },
            // { path: "boards", Component: BoardPage },
            {
                path: "projects",
                Component: ProjectsPage,
                // children: [
                //     {
                //         path: ":projectId",
                //         loader: async ({ params }) => {
                //             if (!params?.projectId)
                //                 throw new Error("Missing projectId");
                //             const data = await getProject(params.projectId);
                //             return data;
                //         },
                //         Component: ProjectPage,
                //     },
                // ],
            },
            {
                path: "projects/:projectId",
                loader: async ({ params }) => {
                    if (!params?.projectId)
                        throw new Error("Missing projectId");
                    const data = await getProject(params.projectId);
                    return data;
                },
                Component: ProjectPage,
            },
        ],
    },
]);

const queryClient = new QueryClient();

function App() {
    // const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

export default App;
