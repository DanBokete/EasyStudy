import { Separator } from "@/components/ui/separator";
import { useLoaderData } from "react-router";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function ProjectPage() {
    const project = useLoaderData();
    return (
        <div>
            <h1 className="font-extrabold text-xl">{project.name}</h1>
            <div className="text-sm font-bold">
                Due Date: {format(project.dueDate, "MMM dd, yyyy")}
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
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>
    );
}

export default ProjectPage;
