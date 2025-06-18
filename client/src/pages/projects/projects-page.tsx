import { useGetAllProjects } from "@/api/projects";
import { Separator } from "@/components/ui/separator";
import ProjectForm from "../../features/projects/project-form";
import Project from "../../features/projects/project";
import NewTask from "@/features/tasks/new-task";

function ProjectsPage() {
    const { isPending, error, data } = useGetAllProjects();

    if (isPending) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-xl font-extrabold">Projects</h1>

                <ProjectForm />
            </div>
            <Separator className="my-2" />

            <NewTask projects={data} project={undefined} />

            <ul className="space-y-2">
                {data &&
                    data.map((project) => (
                        <Project
                            key={project.id}
                            project={project}
                            projects={data}
                        />
                    ))}
            </ul>
        </div>
    );
}

export default ProjectsPage;
