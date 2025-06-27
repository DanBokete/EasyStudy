"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import type { Module } from "@/types/types";
import { Input } from "@/components/ui/input";

export const description = "A stacked bar chart with a legend";

const tickFormatter = (value: number) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");

    return `${hh}:${mm}`;
};

export default function ChartBarStacked({
    chartData,
    chartConfig,
    modules,
    initialDate,
    finalDate,
    setInitialDate,
    setFinalDate,
}: {
    chartData: ({ day: string } | Record<string, string>)[];
    chartConfig: ChartConfig;
    modules: Module[];
    initialDate: string;
    finalDate: string;
    setInitialDate: React.Dispatch<React.SetStateAction<string>>;
    setFinalDate: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Study</CardTitle>
                    <CardDescription>This Week</CardDescription>
                </div>
                <div className="flex items-center gap-x-2">
                    <Input
                        type="date"
                        value={initialDate}
                        max={finalDate}
                        onChange={(e) => setInitialDate(e.target.value)}
                    />

                    <Input
                        type="date"
                        value={finalDate}
                        min={initialDate}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setFinalDate(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-80">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            // tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis tickFormatter={tickFormatter} />
                        <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                            // labelFormatter={(value) => {
                            //     return `label: ${value}`;
                            // }}
                            formatter={(value: number, module) => (
                                <div>
                                    {module}: {tickFormatter(value)}
                                </div>
                            )}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        {modules.map((module) => (
                            <Bar
                                dataKey={module.name.replace(/\s+/g, "-")}
                                stackId={"a"}
                                fill={`var(--color-${module.name.replace(
                                    /\s+/g,
                                    "-"
                                )})`}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
