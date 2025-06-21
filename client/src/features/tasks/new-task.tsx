import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import type { Project, TaskStatus } from "@/types/types";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import NewTaskForm from "./new-task-form";

interface BaseProps {
    children?: React.ReactNode;
    status?: TaskStatus;
}

type NewTaskProps =
    | ({ project: Project; projects?: never } & BaseProps)
    | ({ projects: Project[]; project?: never } & BaseProps);

function NewTask({ projects, children, project, status }: NewTaskProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [project, projects]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button
                        variant={"ghost"}
                        className="flex p-1 rounded justify-start gap-x-5 w-full"
                    >
                        <Plus className="text-blue-500" /> New Task
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </DialogDescription>
                </DialogHeader>
                {project ? (
                    <NewTaskForm
                        project={project}
                        projects={[project]}
                        setOpen={setOpen}
                        status={status}
                    />
                ) : (
                    <NewTaskForm projects={projects} setOpen={setOpen} />
                )}
            </DialogContent>
        </Dialog>
    );
}

export default NewTask;
