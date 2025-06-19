import { Button } from "@/components/ui/button";
import NewTask from "./new-task";
import type { Project, TaskStatus } from "@/types/types";
import { Circle, CircleCheck, CircleDashed, Plus } from "lucide-react";

interface KanbanColumnHeaderProps {
    board: TaskStatus;
    taskCount: number;
    project: Project;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    ["BACKLOG"]: <CircleDashed className="text-yellow-400" />,
    ["IN_PROGRESS"]: <CircleDashed className="text-yellow-400" />,
    ["TODO"]: <Circle className="text-red-400" />,
    ["DONE"]: <CircleCheck className="text-emerald-400" />,
};

function KanbanColumnHeader({
    board,
    taskCount,
    project,
}: KanbanColumnHeaderProps) {
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
            <div>
                {" "}
                <NewTask project={project} status={board}>
                    <Button variant={"ghost"}>
                        <Plus />
                    </Button>
                </NewTask>
            </div>
        </div>
    );
}

export default KanbanColumnHeader;
