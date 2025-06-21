import { useGetAllProjects } from "@/api/projects";
import { Separator } from "@/components/ui/separator";
import Project from "../../features/projects/project";
import NewTask from "@/features/tasks/new-task";
import NewProject from "../../features/projects/new-project";

function ProjectsPage() {
    const { isPending, error, data: projects } = useGetAllProjects();

    if (isPending) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    const unarchivedProjects = projects.filter(
        (project) => project.status !== "ARCHIVED"
    );

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-xl font-extrabold">Projects</h1>

                <NewProject />
            </div>
            <Separator className="my-2" />

            <NewTask projects={unarchivedProjects} />

            <ul className="space-y-2">
                {unarchivedProjects.map((project) => (
                    <Project
                        key={project.id}
                        project={project}
                        projects={projects}
                        unarchivedProjects={unarchivedProjects}
                    />
                ))}
            </ul>
        </div>
    );
}

export default ProjectsPage;
