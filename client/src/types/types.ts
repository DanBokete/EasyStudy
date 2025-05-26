export type Project = {
    userId: string;
    id: string;
    name: string;
    description: string | null;
    module: string | null;
    createdAt: Date;
    updatedAt: Date;
    dueDate: Date | string | null;
    status: string;
    tasks: Task[];
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
    id: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: TaskStatus;
    dueDate: string | null;
    time: string | null;
    title: string;
    projectId: string;
    parentTaskId: string | null;
};
