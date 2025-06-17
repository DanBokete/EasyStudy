import type { Project, Task, TaskStatus } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    type DropResult,
} from "@hello-pangea/dnd";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";
import { useGetAllProjects } from "@/api/projects";

const boards: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

type TaskState = {
    [key in TaskStatus]: Task[];
};

interface DataKanbanProps {
    data: Task[];
    onChange: (
        tasks: { id: string; status: TaskStatus; position: number }[]
    ) => void;
    project: Project;
}

function DataKanban({ data, onChange, project }: DataKanbanProps) {
    // const projects = useGetAllProjects();
    const [tasks, setTasks] = useState<TaskState>(() => {
        const initialTasks: TaskState = {
            ["TODO"]: [],
            ["IN_PROGRESS"]: [],
            ["DONE"]: [],
        };
        data.forEach((task) => {
            initialTasks[task.status].push(task);
        });

        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TaskStatus].sort(
                (a, b) => a.position - b.position
            );
        });

        return initialTasks;
    });

    useEffect(() => {
        const newTasks: TaskState = {
            ["TODO"]: [],
            ["IN_PROGRESS"]: [],
            ["DONE"]: [],
        };

        data.forEach((task) => {
            newTasks[task.status].push(task);
        });

        Object.keys(newTasks).forEach((status) => {
            newTasks[status as TaskStatus].sort(
                (a, b) => a.position - b.position
            );
        });
        setTasks(newTasks);
    }, [data, project]);

    const onDragEnd = useCallback(
        (result: DropResult) => {
            if (!result.destination) return;

            const { source, destination } = result;
            const sourceStatus = source.droppableId as TaskStatus;
            const destinationStatus = destination.droppableId as TaskStatus;

            let updatesPayload: {
                id: string;
                status: TaskStatus;
                position: number;
            }[] = [];

            setTasks((prevTasks) => {
                const newTasks = { ...prevTasks };

                // remove task from the source column
                const sourceColumn = [...newTasks[sourceStatus]];
                const [movedTask] = sourceColumn.splice(source.index, 1);

                // if no moved task (should not happen) return the previous state
                if (!movedTask) {
                    console.error("No task found at the source index");
                    return prevTasks;
                }

                // Create a new task object with potentially updated status
                const updatedMovedTask =
                    sourceStatus !== destinationStatus
                        ? { ...movedTask, status: destinationStatus }
                        : movedTask;

                // update the source column
                newTasks[sourceStatus] = sourceColumn;

                // add task to destination column
                const destinationColumn = [...newTasks[destinationStatus]];
                destinationColumn.splice(
                    destination.index,
                    0,
                    updatedMovedTask
                );
                newTasks[destinationStatus] = destinationColumn;

                // prepare minimal update payload
                updatesPayload = [];
                updatesPayload.push({
                    id: updatedMovedTask.id,
                    status: destinationStatus,
                    position: Math.min(
                        (destination.index + 1) * 1000,
                        1_000_000
                    ),
                });

                // update position for affected tasks in the destination columns
                newTasks[destinationStatus].forEach((task, index) => {
                    if (task && task.id !== updatedMovedTask.id) {
                        const newPosition = Math.min(
                            (index + 1) * 1000,
                            1_000_000
                        );
                        if (task.position !== newPosition) {
                            updatesPayload.push({
                                id: task.id,
                                status: destinationStatus,
                                position: newPosition,
                            });
                        }
                    }
                });

                // if the task moved between columns, update positions in the source column
                if (sourceStatus !== destinationStatus) {
                    newTasks[sourceStatus].forEach((task, index) => {
                        if (task) {
                            const newPosition = Math.min(
                                (index + 1) * 1000,
                                1_000_000
                            );
                            if (task.position !== newPosition) {
                                updatesPayload.push({
                                    id: task.id,
                                    status: sourceStatus,
                                    position: newPosition,
                                });
                            }
                        }
                    });
                }

                return newTasks;
            });
            onChange(updatesPayload);
        },
        [onChange]
    );
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => {
                    return (
                        <div
                            key={board}
                            className="flex-1 mx-2 bg-muted p-1,5 rounded-md min-w-3xs"
                        >
                            <KanbanColumnHeader
                                board={board}
                                taskCount={tasks[board].length}
                                project={project}
                            />
                            <Droppable droppableId={board}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="min-h-52 py-1.5"
                                    >
                                        {tasks[board].map((task, index) => (
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <KanbanCard
                                                            task={task}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
}

export default DataKanban;
