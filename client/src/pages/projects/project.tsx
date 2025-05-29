import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/types/types";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import Task from "./task";
import { Link } from "react-router";

function ProjectContainer({ project }: { project: Project }) {
    const [isTasksVisible, setIsTasksVisible] = useState(true);
    return (
        <li key={project.id}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Button
                        onClick={() => {
                            setIsTasksVisible((prevState) => !prevState);
                        }}
                        variant={"ghost"}
                    >
                        {isTasksVisible ? <ChevronDown /> : <ChevronRight />}
                    </Button>

                    <Link className="font-medium" to={project.id}>
                        {project.name}
                    </Link>
                    <span className="ml-3 text-xs font-bold text-muted-foreground">
                        {project.tasks.length}
                    </span>
                </div>
                <Button variant={"ghost"}>
                    <MoreHorizontal />
                </Button>
            </div>
            <div className="mx-10">
                <Separator className="my-1.5" />
                {isTasksVisible && (
                    <ul>
                        {project.tasks.map((task) => (
                            <li key={task.id}>
                                <Task task={task} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </li>
    );
}

export default ProjectContainer;
