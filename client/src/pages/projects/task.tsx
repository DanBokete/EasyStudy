import { editTask } from "@/api/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { Task, TaskStatus } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import EditTaskForm from "./task-edit-form";

function Task({ task }: { task: Task }) {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const mutateTaskDone = useMutation({
        mutationFn: (data: Partial<Task>) => {
            return editTask(task.id, data);
        },
        onSuccess: () => {
            setOpen(false);
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <div
                className={`flex items-center gap-x-2.5 ${
                    mutateTaskDone.isPending || task.status === "DONE"
                        ? "bg-muted"
                        : ""
                }`}
            >
                <Checkbox
                    disabled={mutateTaskDone.isPending}
                    checked={task.status === "DONE"}
                    onCheckedChange={(checkState) =>
                        mutateTaskDone.mutate({
                            status: checkState ? "DONE" : "IN_PROGRESS",
                        })
                    }
                />
                <DialogTrigger asChild>
                    <button
                        className={`text-left w-full hover:outline rounded px-2.5 ${
                            task.status === "DONE" ? "line-through" : ""
                        }`}
                    >
                        <b className="font-medium">{task.title}</b>
                        {task.dueDate && task.status !== "DONE" && (
                            <Badge variant={"outline"} className="ml-2">
                                {format(task.dueDate, "dd-MM-yyyy")}
                            </Badge>
                        )}
                    </button>
                </DialogTrigger>
            </div>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Task Details</DialogTitle>
                    <DialogDescription>
                        Create a task to complete to bring you one step closer
                        to finishing your project:{" "}
                        <b className="font-medium">{task.title}</b>
                    </DialogDescription>
                </DialogHeader>

                <EditTaskForm task={task} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}

export default Task;
