import { getAllProjects } from "@/api/projects";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ProjectEditForm from "./project-edit-form";
import { format } from "date-fns";
import ProjectForm from "./project-form";
import Task from "./task";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
            <Separator className="mb-2" />

            <ul className="space-y-2">
                {data &&
                    data.map((project) => (
                        <li key={project.id} className=" ">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Button variant={"ghost"}>
                                        <ChevronDown />
                                    </Button>
                                    <Link
                                        className="font-medium"
                                        to={project.id}
                                    >
                                        {project.name}
                                    </Link>
                                    <span className="ml-3 text-xs font-bold text-muted-foreground">
                                        {project.tasks.length}
                                    </span>
                                </div>
                                <Button variant={"ghost"}>
                                    <MoreHorizontal />
                                </Button>
                            </div>
                            <div className="mx-10">
                                <Separator className="my-1.5" />
                                <ul>
                                    {project.tasks.map((task) => (
                                        <li key={task.id}>
                                            <Task task={task} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default ProjectsPage;
