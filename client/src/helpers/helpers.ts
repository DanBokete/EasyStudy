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
