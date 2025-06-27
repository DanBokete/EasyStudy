import { getTimeDifferenceInSeconds } from "@/helpers/helpers";
import type { Module, StudySession } from "@/types/types";

export function getBarChartData(
    studySessions: StudySession[],
    initialDate: string,
    finalDate: string
): { chartData: Array<Record<string, string>>; modules: Module[] } {
    if (!studySessions || studySessions.length === 0) {
        return { chartData: [], modules: [] };
    }
    const dateRange = getTimeRange(initialDate, finalDate);
    const filteredSessions = studySessions.filter((session) => {
        const sessionDate = new Date(session.startTime)
            .toISOString()
            .split("T")[0];
        return sessionDate >= initialDate && sessionDate <= finalDate;
    });
    if (filteredSessions.length === 0) {
        return { chartData: [], modules: [] };
    }

    const modules: Module[] = filteredSessions.map((session) => session.module);
    // Remove duplicates from modules
    const uniqueModuleNames = new Set(modules.map((module) => module.name));
    const uniqueModules: Module[] = Array.from(uniqueModuleNames).map(
        (name) => {
            return modules.find((module) => module.name === name) as Module;
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
                    if (!curr.module) return {};
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

    const completeChartData = dateRange.map((date) => {
        const dataForDate = chartData.find((data) => data?.day === date);
        if (dataForDate) {
            return dataForDate;
        } else {
            const emptyData: Record<string, string> = { day: date };
            return emptyData;
        }
    });

    return { chartData: completeChartData, modules: uniqueModules };
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

export function getTimeRange(initialDate: string, finalDate: string): string[] {
    const start = new Date(initialDate);
    const end = new Date(finalDate);
    const dateArray: string[] = [];

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        dateArray.push(d.toISOString().split("T")[0]);
    }

    return dateArray;
}
