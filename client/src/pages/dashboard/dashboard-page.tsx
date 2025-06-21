import { useGetAllStudySessions } from "@/api/study-session";
import ChartBarStacked from "./bar-chart";
import { getBarChartConfig, getBarChartData } from "./utils";
import { useGetAllModules } from "@/api/modules";
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
import { getUnarchivedProjects } from "@/features/projects/utils";

function DashboardPage() {
    const [initialDate, setInitialDate] = useState(getStartOfWeek());
    const [finalDate, setFinalDate] = useState(getEndOfWeek());
    const studySessions = useGetAllStudySessions();
    const modules = useGetAllModules();
    const projects = useGetAllProjects();
    if (studySessions.isLoading) return "...";
    if (modules.isLoading) return "...";
    if (!projects.data) return "....";
    if (!studySessions.data) return "No session Data";
    if (!modules.data) return "No Modules Data";
    const unarchivedProjects = getUnarchivedProjects(projects.data);
    console.log(initialDate, finalDate);

    const chartData =
        studySessions.data &&
        getBarChartData(studySessions.data, initialDate, finalDate);
    const chartConfig = modules.data && getBarChartConfig(modules.data);

    return (
        <div>
            <div>
                <SectionCards
                    projects={projects.data}
                    unarchivedProjects={unarchivedProjects}
                    studySessions={studySessions.data}
                />
            </div>
            <div className="grid grid-cols-6 gap-x-2 my-2">
                <div className="col-span-2">
                    <UpcomingProjects unarchivedProjects={unarchivedProjects} />
                </div>
                <div className="col-span-4">
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
}

function UpcomingProjects({ unarchivedProjects }: UpcomingProjectsProp) {
    const todayDate = new Date().toISOString().split("T")[0];
    return (
        <Card className="h-full w-full overflow-y-scroll">
            <CardHeader>
                <CardTitle className="text-2xl">Upcoming Projects</CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {unarchivedProjects
                        .filter(
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
                        // .slice(0, 5)
                        .map((project) => (
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
