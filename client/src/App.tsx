import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages";
import Layout from "./layout";
import TasksPage from "./pages/tasks-page";
import BoardPage from "./pages/board-page";
import ProjectsPage from "./pages/projects/projects-page";
import { getProject } from "./api/projects";
import ProjectPage from "./pages/projects/[projectId]/project-page";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            { index: true, Component: HomePage },
            { path: "tasks", Component: TasksPage },
            { path: "boards", Component: BoardPage },
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

function App() {
    // const queryClient = new QueryClient();
    return <RouterProvider router={router} />;
}

export default App;
