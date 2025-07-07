import { useGetAllProjectsBySubjectId, useUpdateProject } from "@/api/projects";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import CreateProjectPopover from "@/features/projects/create-project-popover";
import { MoreHorizontal } from "lucide-react";
import { Link, useParams } from "react-router";

export default function SubjectProjects() {
    const { subjectId } = useParams();
    const {
        data: projects,
        isPending,
        error,
    } = useGetAllProjectsBySubjectId(subjectId!);
    const updateProjectFn = useUpdateProject();
    if (isPending || !projects) return "loading...";
    if (error) return "error";
    return (
        <>
            <CreateProjectPopover subjectId={subjectId!} />

            <ul className="grid grid-cols-3 gap-2 my-3">
                {projects.map((project) => (
                    <Popover key={project.id}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                                <CardDescription>
                                    {project.description}
                                </CardDescription>
                                <CardAction>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <div>{project.dueDate}</div>
                                <div>{project.status}</div>
                                <div>Tasks: {project.tasks.length}</div>
                                <Button asChild>
                                    <Link to={project.id}>View</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <PopoverContent align="end">
                            <Button
                                className="w-full"
                                onClick={() =>
                                    updateProjectFn.mutate({
                                        id: project.id,
                                        status: "ARCHIVED",
                                    })
                                }
                                variant={"destructive"}
                            >
                                Archive
                            </Button>
                        </PopoverContent>
                    </Popover>
                ))}
            </ul>
        </>
    );
}
