import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Task } from "@/types/types";
import { format } from "date-fns";
// import { MoreHorizontal } from "lucide-react";

interface KanbanCardProps {
    task: Task;
}

function KanbanCard({ task }: KanbanCardProps) {
    return (
        <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-x-2">
                <p className="text-sm line-clamp-2">{task.title}</p>
                {/* <TaskAction id={task.id}>
                    <MoreHorizontal className="size-2.5 stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
                </TaskAction> */}
            </div>
            <Separator />
            <div className="flex items-center gap-x-1.5">
                <Badge variant={"outline"}>
                    {task.dueDate
                        ? format(task.dueDate, "dd.MM.yyyy")
                        : "No due date"}
                </Badge>
            </div>
        </div>
    );
}

export default KanbanCard;
