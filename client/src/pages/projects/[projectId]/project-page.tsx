import { Separator } from "@/components/ui/separator";
import { Link, useLoaderData } from "react-router";
import { format } from "date-fns";

import type { TaskStatus } from "@/types/types";
import DataKanban from "@/features/tasks/data-kanban";
import { useCallback } from "react";
import { useUpdateManyTasks } from "@/api/task";
import { useGetProject } from "@/api/projects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksListView from "@/features/tasks/tasks-list-view";
import ProjectStatus from "@/features/projects/project-status";
import EditProject from "@/features/projects/edit-project";
import { Button } from "@/components/ui/button";
import { hasDueDatePassed } from "@/helpers/helpers";
import ProjectTabs from "@/features/projects/project-tabs";

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

    if (isLoading || !project) return <ProjectPageLoader />;

    if (!project.tasks) return "There are no tasks";

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-extrabold text-xl">{project.name}</h1>
                    <div
                        className={`text-sm font-bold ${
                            hasDueDatePassed(project.dueDate) && "text-red-700"
                        }`}
                    >
                        Due Date:{" "}
                        {project.dueDate
                            ? format(project.dueDate, "MMM dd, yyyy")
                            : "Not set"}
                    </div>

                    <p className="text-sm">{project.description}</p>
                </div>
                <div className="flex items-center gap-x-2">
                    <ProjectStatus project={project} />
                    <EditProject project={project} />
                </div>
            </div>
            <Separator className="mb-2" />
            {/* <div></div> */}
            <ProjectTabs project={project} />
        </div>
    );
}

export default ProjectPage;

function ProjectPageLoader() {
    return (
        <>
            <div className="flex justify-between">
                <div className="bg-accent animate-pulse h-8 w-40"></div>
                <div className="bg-accent animate-pulse h-8 w-80"></div>
            </div>
            <div className="grid grid-cols-4 gap-3">
                <div className="h-96 bg-accent"></div>
                <div className="h-96 bg-accent"></div>
                <div className="h-96 bg-accent"></div>
                <div className="h-96 bg-accent"></div>
            </div>
        </>
    );
}
