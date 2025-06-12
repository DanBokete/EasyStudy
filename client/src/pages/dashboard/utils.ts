import { getTimeDifferenceInSeconds } from "@/helpers/helpers";
import type { Module, StudySession } from "@/types/types";

export function getBarChartData(
    studSessions: StudySession[],
    initialDate: string,
    finalDate: string
) {
    if (!studSessions || studSessions.length === 0) {
        return [];
    }
    const dateRange = getBarChartDateRange(initialDate, finalDate);
    const filteredSessions = studSessions.filter((session) => {
        const sessionDate = new Date(session.startTime)
            .toISOString()
            .split("T")[0];
        return sessionDate >= initialDate && sessionDate <= finalDate;
    });
    if (filteredSessions.length === 0) {
        return [];
    }

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
                    const totalTime = getTimeDifferenceInSeconds(
                        curr.startTime,
                        curr.endTime
                    );
                    acc[curr.module.name.replace(/\s+/g, "-")] =
                        (acc[curr.module.name.replace(/\s+/g, "-")] || 0) +
                        totalTime;
                    return acc;
                }, {}),
            };
        }
    );
    console.log("chartData", chartData);

    const completeChartData = dateRange.map((date) => {
        const dataForDate = chartData.find((data) => data?.day === date);
        if (dataForDate) {
            return dataForDate;
        } else {
            const emptyData: Record<string, string> = { day: date };
            return emptyData;
        }
    });

    return completeChartData;
}

export function getBarChartConfig(modules: Module[]) {
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

function getBarChartDateRange(
    initialDate: string,
    finalDate: string
): string[] {
    const start = new Date(initialDate);
    const end = new Date(finalDate);
    const dateArray: string[] = [];

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        dateArray.push(d.toISOString().split("T")[0]);
    }

    return dateArray;
}
