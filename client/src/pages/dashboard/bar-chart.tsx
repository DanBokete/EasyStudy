"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

// const chartData = [
//     { day: "Mon", maths: 999, french: 80 },
//     { day: "Tue", duration: 305, mobile: 200 },
//     { day: "Wed", duration: 237, mobile: 120 },
//     { day: "Thur", duration: 73, mobile: 190 },
//     { day: "Fri", duration: 209, mobile: 130 },
//     { day: "Sat", duration: 209, mobile: 130 },
//     { day: "Sun", duration: 209, mobile: 130 },
// ];

// const chartConfig = {
//     duration: {
//         label: "Duration",
//         color: "var(--chart-1)",
//     },
//     mobile: {
//         label: "Mobile",
//         color: "var(--chart-2)",
//     },
//     maths: {
//         label: "Maths",
//         color: "var(--chart-3)",
//     },
// } satisfies ChartConfig;

export default function ChartBarStacked({
    chartData,
    chartConfig,
    modules,
}: {
    chartData: {
        day: string;
    }[];
    chartConfig: ChartConfig;
    modules: Module[];
}) {
    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Study</CardTitle>
                    <CardDescription>This Week</CardDescription>
                </div>
                <div className="flex items-center gap-x-1">
                    <Input type="date" />
                    -
                    <Input type="date" />
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
                        <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        {modules.map((module) => (
                            <Bar
                                dataKey={module.name}
                                stackId={"a"}
                                fill={`#${Math.floor(
                                    Math.random() * 16777215
                                ).toString(16)}`}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                        {/* <Bar
                            dataKey="d"
                            stackId="a"
                            fill="var(--color-desktop)"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="mobile"
                            stackId="a"
                            fill="var(--color-mobile)"
                            radius={[4, 4, 0, 0]}
                        /> */}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
