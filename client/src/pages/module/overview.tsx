import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Activity, Flag, Library, Timer } from "lucide-react";

function ModuleOverview() {
    return (
        <>
            <div className="grid grid-cols-3 border-y-2 py-3 mb-3">
                <Card className="border-0 shadow/0 py-0">
                    <CardContent className="flex items-center gap-x-3 ">
                        <Flag className="size-10" />
                        <div>
                            <CardTitle>Projects</CardTitle>
                            <CardDescription>Projects Due</CardDescription>
                            <div>{12}</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow/0 border-x-2 rounded-none py-0">
                    <CardContent className="flex items-center gap-x-3">
                        <Timer className="size-10" />
                        <div>
                            <CardTitle>Study</CardTitle>
                            <CardDescription>This Week</CardDescription>
                            <div>22.5hrs</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow/0 py-0">
                    <CardContent className="flex items-center gap-x-3">
                        <Library className="size-10" />
                        <div>
                            <CardTitle>Grade</CardTitle>
                            <CardDescription>Average Grade</CardDescription>
                            <div>79%</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-x-3">
                <Card className="w-2/3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-x-1">
                            Activity <Activity className="size-4" />
                        </CardTitle>
                        <CardDescription>This Week</CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Upcoming Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* <ul>
                            {data.upcomingProjects.map((project) => (
                                <li
                                    key={project.id}
                                    className="flex justify-between"
                                >
                                    <div>{project.name}</div>
                                    <div>
                                        {format(
                                            project.due_date,
                                            "MMM dd, yyyy"
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul> */}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default ModuleOverview;
