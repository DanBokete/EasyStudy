import type { StudySession } from "@/types/types";

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

export function getTimeDifferenceInSeconds(
    startTime: string | Date,
    endTime: string | Date
): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeDifferenceInSeconds = Math.floor(
        (end.getTime() - start.getTime()) / 1000
    );

    return timeDifferenceInSeconds;
}
