import { getTimeDifferenceInSeconds } from "@/helpers/helpers";
import type { Module, StudySession } from "@/types/types";

export function getBarChartData(
    studSessions: StudySession[]
    // modules: Module[]
) {
    const dates: Record<string, StudySession[]> = {};

    studSessions.forEach((session) => {
        const date = new Date(session.startTime).toISOString().split("T")[0];
        if (!dates[date]) {
            dates[date] = [session];
        } else {
            dates[date].push(session);
        }
    });

    const chartData = Object.entries(dates).map(([date, sessions]) => {
        const modules: Record<string, number> = {};
        sessions.forEach((session) => {
            if (!session.endTime) return;
            const moduleName = session.module.name;

            if (!modules[moduleName]) {
                modules[moduleName] =
                    getTimeDifferenceInSeconds(
                        session.startTime,
                        session.endTime
                    ) / 60;
            } else {
                modules[moduleName] +=
                    getTimeDifferenceInSeconds(
                        session.startTime,
                        session.endTime
                    ) / 60;
            }
        });
        return {
            day: date,
            ...modules,
        };
    });

    return chartData;
}

export function getBarChartConfig(modules: Module[]) {
    const config: Record<string, { label: string; color: string }> = {};

    modules.forEach((module, index) => {
        config[module.name] = {
            label: module.name,
            color: `var(--chart-${(index % 6) + 1})`,
        };
    });

    return config;
}
