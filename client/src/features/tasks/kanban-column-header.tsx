import { Button } from "@/components/ui/button";
import NewTask from "./new-task";
import type { Project, TaskStatus } from "@/types/types";
import { Circle, CircleCheck, CircleDashed, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCreateTask } from "@/api/task";
import { useEffect, useState } from "react";
import Task from "./task";

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
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTask, setNewTask] = useState("");
    const icon = statusIconMap[board];
    const createTaskFn = useCreateTask();

    function addTask() {
        if (!newTask.trim()) return setIsAddingTask(false);
        createTaskFn.mutate({
            projectId: project.id,
            title: newTask,
            status: board,
        });
        setIsAddingTask(false);
        setNewTask("");
    }

    return (
        <>
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
                    {/* <NewTask project={project} status={board}>
                        <Button variant={"ghost"}>
                            <Plus />
                        </Button>
                    </NewTask> */}
                    <Button
                        onClick={() => setIsAddingTask(true)}
                        variant={"ghost"}
                    >
                        <Plus />
                    </Button>
                </div>
            </div>
            {createTaskFn.isPending && (
                <div>
                    <Input disabled value={newTask} />
                </div>
            )}
            {isAddingTask && (
                <Input
                    autoFocus
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onBlur={addTask}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
            )}
        </>
    );
}

export default KanbanColumnHeader;
