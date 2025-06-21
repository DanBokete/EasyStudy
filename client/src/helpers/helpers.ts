import { getTimeRange } from "@/pages/dashboard/utils";
import type { Project, StudySession } from "@/types/types";
import { format } from "date-fns";

export function groupStudySessionByDate(studySessions: StudySession[]): {
    [dateKey: string]: StudySession[];
} {
    const groupedSessions: { [dateKey: string]: StudySession[] } = {};

    studySessions.forEach((studySession) => {
        const dateKey = new Date(studySession.startTime)
            .toISOString()
            .split("T")[0];
        if (!groupedSessions[dateKey]) {
            groupedSessions[dateKey] = [studySession];
        } else {
            groupedSessions[dateKey].push(studySession);
        }
    });

    return groupedSessions;
}

export function getDisplayedDuration(timeInSeconds: number): string {
    if (timeInSeconds <= 0) {
        return "00:00:00";
    }

    const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(
        2,
        "0"
    );
    const seconds = String(Math.floor(timeInSeconds) % 60).padStart(2, "0");

    const formattedDisplayedDuration = `${hours}:${minutes}:${seconds}`;

    return formattedDisplayedDuration;
}

export function getDisplayedDurationFromDate(
    startTime: string | Date,
    endTime: string | Date
): string {
    const timeDifferenceInSeconds = getTimeDifferenceInSeconds(
        startTime,
        endTime
    );
    return getDisplayedDuration(timeDifferenceInSeconds);
}

export function getTimeDifferenceInSeconds(
    startTime: string | Date,
    endTime: string | Date
): number {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end < start) {
        end.setDate(start.getDate() + 1);
    }

    const timeDifferenceInSeconds = Math.floor(
        (end.getTime() - start.getTime()) / 1000
    );

    return timeDifferenceInSeconds;
}

export function getStartOfWeek(date = new Date()) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return format(new Date(date.setDate(diff)), "yyyy-MM-dd");
}

export function getEndOfWeek(date = new Date()) {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(new Date(startOfWeek).getDate() + 6);
    return format(endOfWeek, "yyyy-MM-dd");
}
export function getHoursStudiedThisWeek(studySessions: StudySession[]) {
    const week = getTimeRange(getStartOfWeek(), getEndOfWeek());
    let accumulatedHours = 0;

    studySessions.forEach((studySession) => {
        if (week.includes(studySession.startTime.toString().split("T")[0])) {
            accumulatedHours +=
                getTimeDifferenceInSeconds(
                    studySession.startTime,
                    studySession.endTime
                ) / 3600;
        }
    });

    return Math.round(accumulatedHours * 100) / 100;
}

export function getHoursStudiedToday(studySessions: StudySession[]) {
    const today = new Date().toISOString().split("T")[0];
    let accumulatedHours = 0;

    studySessions.forEach((studySession) => {
        if (today === studySession.startTime.toString().split("T")[0]) {
            accumulatedHours +=
                getTimeDifferenceInSeconds(
                    studySession.startTime,
                    studySession.endTime
                ) / 3600;
        }
    });

    return Math.round(accumulatedHours * 100) / 100;
}

export function getProjectProgress(project: Project) {
    const totalProjects = project.tasks.length;
    const numberOfCompletedProjects = project.tasks.filter(
        (task) => task.status === "DONE"
    ).length;

    return (
        Math.round((numberOfCompletedProjects / totalProjects) * 100 * 100) /
        100
    );
}

export function getNumberOfOverdueTasks(project: Project) {
    const today = new Date().toISOString().split("T")[0];

    return project.tasks.filter(
        (task) => task.dueDate?.toString().split("T")[0] ?? "" < today
    ).length;
}

export function getComputedTimeIsoString(
    startTime: string,
    endTime: string
): [string, string] {
    const datePart = startTime.split("T")[0];
    const startTimeOnly = startTime.split("T")[1];
    const endTimeOnly = endTime.split("T")[1];

    const start = new Date(`${datePart}T${startTimeOnly}`);
    const computedEnd = new Date(`${datePart}T${endTimeOnly}`);

    if (computedEnd.getTime() < start.getTime()) {
        computedEnd.setDate(computedEnd.getDate() + 1);
    }

    return [start.toISOString(), computedEnd.toISOString()];
}

export function hasDueDatePassed(dueDate: string): boolean {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due <= todayDate;
}
