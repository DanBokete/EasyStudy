import { useGetAllProjects } from "@/api/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getArchivedProjects } from "@/features/projects/utils";
import { Trash2 } from "lucide-react";
import { Link } from "react-router";

function ArchivedProjectsPage() {
    const projectsQuery = useGetAllProjects();
    const { data: projects, isLoading, error } = projectsQuery;
    if (isLoading || !projects) return "loading....";
    if (error) return "error loading projects";
    const archivedProjects = getArchivedProjects(projects);

    return (
        <>
            <h1 className="text-lg">Archived Projects</h1>
            <Separator className="my-2" />
            <ul className="space-y-2">
                {archivedProjects.map((project) => (
                    <li key={project.id}>
                        <Link to={`/projects/${project.id}`}>
                            <Card className="py-1">
                                <CardContent className="flex justify-between items-center">
                                    <div>{project.name}</div>
                                    <Button
                                        title="permanently delete"
                                        variant={"outline"}
                                    >
                                        <Trash2 />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ArchivedProjectsPage;
