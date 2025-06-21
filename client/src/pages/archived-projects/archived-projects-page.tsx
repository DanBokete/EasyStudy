import { useGetAllProjects } from "@/api/projects";
import { Card, CardContent } from "@/components/ui/card";
import { getArchivedProjects } from "@/features/projects/utils";
import { Link } from "react-router";

function ArchivedProjectsPage() {
    const projectsQuery = useGetAllProjects();
    const { data: projects, isLoading, error } = projectsQuery;
    if (isLoading || !projects) return "loading....";
    if (error) return "error loading projects";
    const archivedProjects = getArchivedProjects(projects);

    return (
        <ul className="space-y-4">
            {archivedProjects.map((project) => (
                <li key={project.id}>
                    <Link to={`/projects/${project.id}`}>
                        <Card className="py-3">
                            <CardContent>
                                <div className="font-semibold">
                                    {project.name}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default ArchivedProjectsPage;
