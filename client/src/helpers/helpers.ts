import type { StudySession } from "@/types/types";
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
    console.log(
        "getDisplayedDuration called with timeInSeconds:",
        timeInSeconds
    );

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
