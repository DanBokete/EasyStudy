import { useGetAllSubjects } from "@/api/subject";
import { Card, CardContent } from "@/components/ui/card";

import { NavLink } from "react-router";

function GradesPage() {
    const modules = useGetAllSubjects();
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">My Subjects</h1>
            <div className="space-y-2">
                {modules.data?.length ? (
                    modules.data.map((module) => (
                        <NavLink
                            key={module.id}
                            to={module.id}
                            className="block"
                        >
                            <Card className="py-2 gap-2 border hover:border-muted-foreground hover:shadow-lg">
                                <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center ">
                                    <div className="text-xl font-semibold">
                                        {module.name}
                                    </div>
                                    <div className="text-sm md:text-base">
                                        {module.averageGrade ? (
                                            <span className="inline-block px-2 py-1 border-2 border-green-800 bg-green-200 text-green-800 rounded-lg font-medium">
                                                {module.averageGrade}%
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground italic">
                                                No grades recorded
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </NavLink>
                    ))
                ) : (
                    <div className="text-center text-gray-500 italic">
                        No modules available.
                    </div>
                )}
            </div>
        </div>
    );
}

export default GradesPage;
