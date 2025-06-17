import { Separator } from "@/components/ui/separator";
import { useLoaderData } from "react-router";
import { format } from "date-fns";

import type { Project, TaskStatus } from "@/types/types";
import DataKanban from "@/features/tasks/data-kanban";
import { useCallback } from "react";
import { useUpdateManyTasks } from "@/api/task";

function ProjectPage() {
    const project: Project = useLoaderData();
    const useTasks = useUpdateManyTasks();

    const onKanbanChange = useCallback(
        (tasks: { id: string; status: TaskStatus; position: number }[]) => {
            useTasks.mutate(tasks);
            console.log(tasks);
        },
        []
    );

    return (
        <div>
            <h1 className="font-extrabold text-xl">{project.name}</h1>
            <div className="text-sm font-bold">
                Due Date:{" "}
                {project.dueDate
                    ? format(project.dueDate, "MMM dd, yyyy")
                    : "Not set"}
            </div>
            <p className="text-sm">{project.description}</p>
            <Separator className="mb-2" />

            {/* <div className="flex justify-end">
                <Button>
                    <Plus /> Add Task
                </Button>
            </div> */}

            <h2 className="font-medium text-xl">Board</h2>
            <DataKanban data={project.tasks} onChange={onKanbanChange} />

            {/* <div>
                <h2>Todo</h2>
                <ul>
                    {project.tasks.map((task) => (
                        <li>{task.title}</li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
}

export default ProjectPage;
