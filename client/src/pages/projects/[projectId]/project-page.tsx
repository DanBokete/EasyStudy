import { Separator } from "@/components/ui/separator";
import { useLoaderData } from "react-router";
import { format } from "date-fns";

import type { TaskStatus } from "@/types/types";
import DataKanban from "@/features/tasks/data-kanban";
import { useCallback } from "react";
import { useUpdateManyTasks } from "@/api/task";
import { useGetProject } from "@/api/projects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksListView from "@/features/tasks/tasks-list-view";

function ProjectPage() {
    const projectId: string = useLoaderData();
    const { data: project, isLoading } = useGetProject(projectId);
    const useTasks = useUpdateManyTasks();

    const onKanbanChange = useCallback(
        (tasks: { id: string; status: TaskStatus; position: number }[]) => {
            useTasks.mutate(tasks);
            console.log(tasks);
        },
        []
    );

    if (isLoading) return "...";
    if (!project) return "No project";
    console.log(project);

    if (!project.tasks) return "There are no tasks";

    return (
        <div>
            <div className="flex">
                <div>
                    <h1 className="font-extrabold text-xl">{project.name}</h1>
                    <div className="text-sm font-bold">
                        Due Date:{" "}
                        {project.dueDate
                            ? format(project.dueDate, "MMM dd, yyyy")
                            : "Not set"}
                    </div>

                    <p className="text-sm">{project.description}</p>
                </div>
                <div></div>
            </div>
            <Separator className="mb-2" />
            <Tabs defaultValue="board">
                <TabsList>
                    <TabsTrigger value="board">Board</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
                <TabsContent value="board">
                    <DataKanban
                        data={project.tasks}
                        onChange={onKanbanChange}
                        project={project}
                    />
                </TabsContent>
                <TabsContent value="list">
                    <TasksListView tasks={project.tasks} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ProjectPage;
