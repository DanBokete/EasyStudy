import { useGetAllStudySessions } from "@/api/study-session";
import ChartBarStacked from "./bar-chart";
import { getBarChartConfig, getBarChartData } from "./utils";
import { useGetAllSubjects } from "@/api/subject";
import { useState } from "react";
import {
    getEndOfWeek,
    getNumberOfOverdueTasks,
    getProjectProgress,
    getStartOfWeek,
} from "@/helpers/helpers";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useGetAllProjects } from "@/api/projects";
import { format, formatDistanceToNow } from "date-fns";
import SectionCards from "./section-card";
import type { Project } from "@/types/types";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    getOverdueProjects,
    getUnarchivedProjects,
    getUpcomingProjects,
} from "@/features/projects/utils";
import { Separator } from "@/components/ui/separator";

function DashboardPage() {
    const [initialDate, setInitialDate] = useState(getStartOfWeek());
    const [finalDate, setFinalDate] = useState(getEndOfWeek());
    const studySessions = useGetAllStudySessions();
    const modules = useGetAllSubjects();
    const projects = useGetAllProjects();
    if (studySessions.isLoading || !studySessions.data)
        return "Loading sessions...";
    if (modules.isLoading || !projects.data) return "Loading modules...";
    const unarchivedProjects = getUnarchivedProjects(projects.data);

    console.log(initialDate, finalDate);

    const { chartData, subjects: legendSubjects } = getBarChartData(
        studySessions.data,
        initialDate,
        finalDate
    );
    console.log("chartData", chartData);
    console.log("chartData", chartData);

    const chartConfig = (modules.data && getBarChartConfig(modules.data)) || {
        test: { label: "", color: "" },
    };
    console.log("chartConfig", chartConfig);

    return (
        <div className="space-y-2.5">
            <div className="flex gap-x-2.5">
                <div className="space-y-2.5 w-full">
                    <div>
                        <SectionCards
                            projects={projects.data}
                            unarchivedProjects={unarchivedProjects}
                            studySessions={studySessions.data}
                        />
                    </div>
                    <div>
                        <div>
                            <ChartBarStacked
                                chartData={chartData}
                                chartConfig={chartConfig}
                                modules={legendSubjects}
                                initialDate={initialDate}
                                finalDate={finalDate}
                                setInitialDate={setInitialDate}
                                setFinalDate={setFinalDate}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-96 flex">
                    <ProjectsSummary unarchivedProjects={unarchivedProjects} />
                </div>
            </div>

            <div>
                <ProjectTracker
                    projects={projects.data}
                    unarchivedProjects={unarchivedProjects}
                />
            </div>
        </div>
    );
}

interface UpcomingProjectsProp {
    unarchivedProjects: Project[];
    archivedProjects?: Project[];
}

function ProjectsSummary({ unarchivedProjects }: UpcomingProjectsProp) {
    const upcomingProjects = getUpcomingProjects(unarchivedProjects);
    const overdueProjects = getOverdueProjects(unarchivedProjects);
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Projects Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-lg font-semibold">Upcoming Projects</div>
                <Separator />
                <ul>
                    {upcomingProjects.map((project) => (
                        <li
                            key={project.id}
                            className="grid grid-cols-3 gap-x-2"
                        >
                            <div className="col-span-2">{project.name}</div>
                            <div className="font-bold">
                                {formatDistanceToNow(
                                    project.dueDate ?? ""
                                ).replace("about", "")}
                            </div>
                        </li>
                    ))}
                </ul>

                <div>
                    <div className="text-lg text-red-700 font-semibold">
                        Overdue Projects
                    </div>
                    <Separator />
                    <ul>
                        {overdueProjects.map((project) => (
                            <li
                                key={project.id}
                                className="grid grid-cols-3 gap-x-2"
                            >
                                <div className="col-span-2">{project.name}</div>
                                <div className="font-bold text-red-700">
                                    {format(project.dueDate, "dd.MM")}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}

interface ProjectTrackerProp {
    projects: Project[];
    unarchivedProjects: Project[];
}

function ProjectTracker({ unarchivedProjects }: ProjectTrackerProp) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Quick Project Overview</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>A list of your projects.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Overdue Tasks</TableHead>
                            <TableHead>Due Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {unarchivedProjects
                            .filter((project) => project.status !== "ARCHIVED")
                            .map((project) => {
                                const projectProgress =
                                    getProjectProgress(project);
                                const numberOfOverdueTasks =
                                    getNumberOfOverdueTasks(project);
                                return (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">
                                            {project.name}
                                        </TableCell>
                                        <TableCell>
                                            {projectProgress === 100
                                                ? "Completed"
                                                : "In Progress"}
                                        </TableCell>
                                        <TableCell>
                                            {project.tasks.length
                                                ? projectProgress + "%"
                                                : "0%"}
                                        </TableCell>
                                        <TableCell>
                                            {numberOfOverdueTasks}
                                        </TableCell>
                                        <TableCell>
                                            {project.dueDate
                                                ? format(
                                                      project.dueDate.toString(),
                                                      "dd LLL yyyy"
                                                  )
                                                : "No due date"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default DashboardPage;
