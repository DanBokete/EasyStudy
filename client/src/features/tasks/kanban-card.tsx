import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Task } from "@/types/types";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import EditTaskDialogContent from "./edit-task-dialog-content";
// import { MoreHorizontal } from "lucide-react";

interface KanbanCardProps {
    task: Task;
}

function KanbanCard({ task }: KanbanCardProps) {
    const [, setOpen] = useState(false);
    return (
        <div className="bg-card p-2.5 mb-1.5 rounded shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-x-2">
                <p className="text-sm line-clamp-2">{task.title}</p>
                {/* <TaskAction id={task.id}>
                    <MoreHorizontal className="size-2.5 stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
                </TaskAction> */}
            </div>
            <Separator />
            <div className="flex items-center gap-x-1.5 justify-between">
                <Badge variant={"outline"}>
                    {task.dueDate
                        ? format(task.dueDate, "dd.MM.yyyy")
                        : "No due date"}
                </Badge>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={"ghost"}>
                            <MoreVertical />
                        </Button>
                    </DialogTrigger>

                    <EditTaskDialogContent setOpen={setOpen} task={task} />
                </Dialog>
            </div>
        </div>
    );
}

export default KanbanCard;
