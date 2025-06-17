import { Button } from "@/components/ui/button";
import type { TaskStatus } from "@/types/types";
import { Circle, CircleCheck, CircleDashed, Plus } from "lucide-react";

interface KanbanColumnHeaderProps {
    board: TaskStatus;
    taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    ["IN_PROGRESS"]: <CircleDashed className="text-yellow-400" />,
    ["TODO"]: <Circle className="text-red-400" />,
    ["DONE"]: <CircleCheck className="text-emerald-400" />,
};

function KanbanColumnHeader({ board, taskCount }: KanbanColumnHeaderProps) {
    const icon = statusIconMap[board];
    return (
        <div className="px-2 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                {icon}
                <h2 className="text-sm font-medium">
                    {board.replace("_", " ")}
                </h2>
                <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-sm text-neutral-700 font-medium">
                    {taskCount}
                </div>
            </div>
            <Button variant={"ghost"} size={"icon"} className="size-5">
                <Plus className="size-4 text-neutral-500" />
            </Button>
        </div>
    );
}

export default KanbanColumnHeader;
