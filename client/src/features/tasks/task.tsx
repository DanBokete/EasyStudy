import { deleteTask, editTask } from "@/api/task";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { Task as TaskType } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import EditTaskForm from "./task-edit-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Task({ task }: { task: TaskType }) {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const mutateTaskDone = useMutation({
        mutationFn: (data: Partial<TaskType>) => {
            return editTask(task.id, data);
        },
        onSuccess: () => {
            setOpen(false);
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    const onDelete = useMutation({
        mutationFn: () => {
            return deleteTask(task.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <div
                className={`flex items-center gap-x-2.5 p-2 ${
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
                        className={`text-left w-full hover:cursor-pointer rounded px-2.5 ${
                            task.status === "DONE" ? "line-through" : ""
                        }`}
                    >
                        <b className="font-medium">{task.title}</b>

                        {task.dueDate && task.status !== "DONE" && (
                            <Badge variant={"outline"} className="ml-2">
                                {format(task.dueDate, "dd-MM-yyyy")}
                            </Badge>
                        )}

                        {task.status !== "DONE" && (
                            <Badge className="ml-2" variant={"outline"}>
                                {task.status}
                            </Badge>
                        )}
                    </button>
                </DialogTrigger>
                <Button
                    variant={"ghost"}
                    disabled={onDelete.isPending}
                    onClick={() => {
                        onDelete.mutate();
                    }}
                >
                    <Trash2 />
                </Button>
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
