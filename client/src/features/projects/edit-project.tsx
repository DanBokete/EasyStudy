import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import ProjectEditForm from "./project-edit-form";
import type { Project } from "@/types/types";
import { Link } from "react-router";
import { useEffect, useState } from "react";

interface EditProjectProps {
    project: Project;
}
export function EditProject({ project }: EditProjectProps) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(false);
    }, [project]);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={"icon"} variant={"ghost"}>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>About Project</DialogTitle>
                    <DialogDescription>
                        View project details and for more details{" "}
                        <Button className="p-0" asChild variant={"link"}>
                            <Link className="font-medium" to={project.id}>
                                Click here
                            </Link>
                        </Button>
                    </DialogDescription>
                </DialogHeader>
                <ProjectEditForm project={project} />
            </DialogContent>
        </Dialog>
    );
}

export default EditProject;
