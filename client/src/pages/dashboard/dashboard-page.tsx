import { useGetAllStudySessions } from "@/api/study-session";
import ChartBarStacked from "./bar-chart";
import { getBarChartConfig, getBarChartData } from "./utils";
import { useGetAllModules } from "@/api/modules";
import { useState } from "react";
import { getEndOfWeek, getStartOfWeek } from "@/helpers/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllProjects } from "@/api/projects";
import { format } from "date-fns/format";
import { formatDistanceToNow } from "date-fns";

function DashboardPage() {
    const [initialDate, setInitialDate] = useState(getStartOfWeek());
    const [finalDate, setFinalDate] = useState(getEndOfWeek());
    const studySessions = useGetAllStudySessions();
    const modules = useGetAllModules();
    const projects = useGetAllProjects();
    if (studySessions.isLoading) return "...";
    if (modules.isLoading) return "...";
    if (!studySessions.data) return "No session Data";
    if (!modules.data) return "No Modules Data";
    console.log(initialDate, finalDate);

    const chartData =
        studySessions.data &&
        getBarChartData(studySessions.data, initialDate, finalDate);
    const chartConfig = modules.data && getBarChartConfig(modules.data);

    const todayDate = new Date().toISOString().split("T")[0];

    return (
        <div>
            <div>
                <ChartBarStacked
                    chartData={chartData}
                    chartConfig={chartConfig}
                    modules={modules.data}
                    initialDate={initialDate}
                    finalDate={finalDate}
                    setInitialDate={setInitialDate}
                    setFinalDate={setFinalDate}
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Upcoming Projects
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul>
                        {projects.data
                            ?.filter(
                                (project) =>
                                    project.dueDate &&
                                    project.dueDate.toString().split("T")[0] >=
                                        todayDate
                            )
                            .sort((a, b) => {
                                if (!a.dueDate || !b.dueDate) return 0;
                                return (
                                    new Date(a.dueDate).getTime() -
                                    new Date(b.dueDate).getTime()
                                );
                            })
                            .slice(0, 5)
                            .map((project) => (
                                <li className="flex gap-x-2">
                                    <div className="">{project.name}</div>
                                    <div className="font-bold">
                                        {formatDistanceToNow(
                                            project.dueDate ?? ""
                                        )}
                                    </div>
                                </li>
                            ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

export default DashboardPage;
