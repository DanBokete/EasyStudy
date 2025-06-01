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
import Task from "./task";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "@/api/projects";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ProjectEditForm from "./project-edit-form";
import NewTask from "./new-task";
import NewTaskForm from "./new-task-form";

function ProjectContainer({
    projects,
    project,
}: {
    projects: Project[];
    project: Project;
}) {
    const [isTasksVisible, setIsTasksVisible] = useState(true);
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: () => {
            return deleteProject(project.id);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    return (
        <li
            key={project.id}
            className={`mx-10 ${mutate.isPending && "opacity-15"}`}
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

                    <Dialog>
                        <DialogTrigger>{project.name}</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>About Project</DialogTitle>
                                <DialogDescription>
                                    View project details and for more details{" "}
                                    <Button
                                        className="p-0"
                                        asChild
                                        variant={"link"}
                                    >
                                        <Link
                                            className="font-medium"
                                            to={project.id}
                                        >
                                            Click here
                                        </Link>
                                    </Button>
                                </DialogDescription>
                            </DialogHeader>
                            <ProjectEditForm project={project} />
                        </DialogContent>
                    </Dialog>

                    <span className="ml-3 text-xs font-bold text-muted-foreground">
                        {project.tasks.length}
                    </span>
                </div>
                <div className="space-x-1">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant={"ghost"}>
                                <Plus />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Task</DialogTitle>
                                <DialogDescription>
                                    Add a task to your project
                                </DialogDescription>
                            </DialogHeader>
                            <NewTaskForm
                                projects={projects}
                                project={project}
                                setOpen={setOpen}
                            />
                        </DialogContent>
                    </Dialog>
                    <Button variant={"ghost"} asChild>
                        <Link className="font-medium" to={project.id}>
                            <ExternalLink />
                        </Link>
                    </Button>
                    <Button variant={"ghost"} onClick={() => mutate.mutate()}>
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
