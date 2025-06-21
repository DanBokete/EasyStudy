import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/types/types";
import {
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Plus,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import Task from "../tasks/task";
import { Link } from "react-router";
import { useDeleteProject } from "@/api/projects";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import NewTaskForm from "../tasks/new-task-form";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ProjectStatus from "./project-status";
import EditProject from "./edit-project";
import NewTask from "../tasks/new-task";

interface ProjectContainerProps {
    projects: Project[];
    project: Project;
    unarchivedProjects: Project[];
}

function ProjectContainer({
    project,
    unarchivedProjects,
}: ProjectContainerProps) {
    const [isTasksVisible, setIsTasksVisible] = useState(true);
    const [open, setOpen] = useState(false);

    const projectDeleteMutation = useDeleteProject();

    return (
        <li
            key={project.id}
            className={`mx-10 ${
                projectDeleteMutation.isPending && "opacity-15"
            }`}
        >
            <div className="flex items-center justify-between ">
                <div className="flex items-center">
                    <Button
                        onClick={() => {
                            setIsTasksVisible((prevState) => !prevState);
                        }}
                        variant={"ghost"}
                    >
                        {isTasksVisible ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                    <div>{project.name}</div>

                    <span className="ml-3 text-xs font-bold text-muted-foreground">
                        {project.tasks.length}
                    </span>
                </div>
                <div className="gap-x-1 flex">
                    <ProjectStatus project={project} />

                    <Badge
                        variant={
                            project.dueDate &&
                            project.dueDate <= new Date().toISOString()
                                ? "destructive"
                                : "default"
                        }
                    >
                        {project.dueDate
                            ? format(project.dueDate, "dd.MM.yyyy")
                            : "No due date"}
                    </Badge>
                    <NewTask project={project}>
                        <Button variant={"ghost"}>
                            {" "}
                            <Plus />
                        </Button>
                    </NewTask>
                    <EditProject project={project} />
                    <Button variant={"ghost"} asChild>
                        <Link className="font-medium" to={project.id}>
                            <ExternalLink />
                        </Link>
                    </Button>
                    <Button
                        variant={"ghost"}
                        onClick={() => projectDeleteMutation.mutate(project.id)}
                    >
                        <Trash2 />
                    </Button>
                </div>
            </div>
            <div>
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
