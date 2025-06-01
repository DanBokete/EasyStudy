import { Separator } from "@/components/ui/separator";
import { useLoaderData } from "react-router";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Project } from "@/types/types";

function ProjectPage() {
    const project: Project = useLoaderData();
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

            <div className="flex justify-end">
                <Button>
                    <Plus /> Add Task
                </Button>
            </div>

            <div>
                <h2>Todo</h2>
                <ul>
                    {project.tasks.map((task) => (
                        <li>{task.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ProjectPage;
