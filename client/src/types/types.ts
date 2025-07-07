export type Project = {
    userId: string;
    id: string;
    name: string;
    description: string | null;
    module: string | null;
    createdAt: string;
    updatedAt: Date;
    dueDate: string;
    status: string;
    tasks: Task[];
    subjectId: string;
};

export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";

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
    position: number;
};

export type StudySession = {
    id: string;
    activity: string;
    description: string | null;
    userId: string;
    subjectId: string;
    startTime: string;
    endTime: string;
    displayedStartTime: string;
    displayedEndTime: string;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
    subject: Subject;
};

export type Subject = {
    id: string;
    name: string;
    description: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    averageGrade: null | number;
};

export type SubjectOverview = {
    subjectName: string;
    subjectDescription: string | null;
    subjectId: string;
    upcomingProjects: Project[];
};

export type KanbanTask = {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
};
export type Grade = {
    id: string;
    title: string;
    description?: string;
    date: string;
    userId: string;
    subjectId: string;
    score: number;
    maxScore: number;
    createdAt: Date;
    updatedAt: Date;
    percent: number;
};
export type User = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    totalXp: number;
};
