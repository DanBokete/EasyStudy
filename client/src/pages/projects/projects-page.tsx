import { getAllProjects } from "@/api/projects";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import ProjectForm from "./project-form";
import Task from "./task";
import NewTask from "./new-task";
import Project from "./project";

function ProjectsPage() {
    const { isPending, error, data } = useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });

    if (isPending) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-xl font-extrabold">Projects</h1>
                {/* <Button variant={"ghost"}>
                    <PlusCircle />
                    Create Project
                </Button> */}
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
