import { getTimeDifferenceInSeconds } from "@/helpers/helpers";
import type { Subject, StudySession } from "@/types/types";

export function getBarChartData(
    studySessions: StudySession[],
    initialDate: string,
    finalDate: string
): { chartData: Array<Record<string, string>>; subjects: Subject[] } {
    if (!studySessions || studySessions.length === 0) {
        return { chartData: [], subjects: [] };
    }

    const dateRange = getTimeRange(initialDate, finalDate);
    const filteredSessions = studySessions.filter((session) => {
        const sessionDate = new Date(session.startTime)
            .toISOString()
            .split("T")[0];
        return sessionDate >= initialDate && sessionDate <= finalDate;
    });
    if (filteredSessions.length === 0) {
        return { chartData: [], subjects: [] };
    }

    console.log(filteredSessions);

    const subjects: Subject[] = filteredSessions.map(
        (session) => session.subject
    );

    // Remove duplicates from subjects
    const uniqueSubjectNames = new Set(subjects.map((subject) => subject.name));
    const uniqueSubjects: Subject[] = Array.from(uniqueSubjectNames).map(
        (name) => {
            return subjects.find(
                (subject) => subject.name && subject.name === name
            ) as Subject;
        }
    );

    const groupedFilteredSessionsByDate: Record<string, StudySession[]> = {};
    filteredSessions.forEach((session) => {
        const date = new Date(session.startTime).toISOString().split("T")[0];
        if (!groupedFilteredSessionsByDate[date]) {
            groupedFilteredSessionsByDate[date] = [session];
        } else {
            groupedFilteredSessionsByDate[date].push(session);
        }
    });

    console.log("groupedFilteredSessionsByDate", groupedFilteredSessionsByDate);

    const chartData = Object.entries(groupedFilteredSessionsByDate).map(
        ([date, sessions]) => {
            return {
                day: date,
                ...sessions.reduce((acc: Record<string, number>, curr) => {
                    if (!curr.subject) return {};
                    const totalTime = getTimeDifferenceInSeconds(
                        curr.startTime,
                        curr.endTime
                    );
                    acc[curr.subject.name.replace(/\s+/g, "-")] =
                        (acc[curr.subject.name.replace(/\s+/g, "-")] || 0) +
                        totalTime;
                    return acc;
                }, {}),
            };
        }
    );

    const completeChartData = dateRange.map((date) => {
        const dataForDate = chartData.find((data) => data?.day === date);
        if (dataForDate) {
            return dataForDate;
        } else {
            const emptyData: Record<string, string> = { day: date };
            return emptyData;
        }
    });

    return { chartData: completeChartData, subjects: uniqueSubjects };
}

export function getBarChartConfig(modules: Subject[]) {
    if (!modules || modules.length === 0) {
        return {};
    }
    const config: Record<string, { label: string; color: string }> = {};

    modules.forEach((module, index) => {
        config[module.name.replace(/\s+/g, "-")] = {
            label: module.name.replace(/\s+/g, "-"),
            color: `var(--chart-${(index % 6) + 1})`,
        };
    });

    return config;
}

export function getTimeRange(initialDate: string, finalDate: string): string[] {
    const start = new Date(initialDate);
    const end = new Date(finalDate);
    const dateArray: string[] = [];

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        dateArray.push(d.toISOString().split("T")[0]);
    }

    return dateArray;
}
