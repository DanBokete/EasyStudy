import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    getHoursStudiedThisWeek,
    getHoursStudiedToday,
} from "@/helpers/helpers";
import type { Project, StudySession } from "@/types/types";

interface SectionCardsProp {
    projects: Project[];
    unarchivedProjects: Project[];
    studySessions: StudySession[] | [] | undefined;
}

function SectionCards({ unarchivedProjects, studySessions }: SectionCardsProp) {
    return (
        <div className="grid grid-cols-3 gap-x-2">
            <Card className="py-2">
                <CardHeader>
                    <CardDescription>Total Projects</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {unarchivedProjects.length ?? "No projects found"}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="py-2">
                <CardHeader>
                    <CardDescription>
                        Total Study Hour This Week
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {studySessions
                            ? getHoursStudiedThisWeek(studySessions) + "hrs"
                            : "No Record found"}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="py-2">
                <CardHeader>
                    <CardDescription>Today Study Time</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {studySessions
                            ? getHoursStudiedToday(studySessions) + "hrs"
                            : "No Record found"}
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}

export default SectionCards;
