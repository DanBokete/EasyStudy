import { editProject } from "@/api/projects";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Project } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

function ProjectEditForm({ project }: { project: Project }) {
    const [dueDate, setDueDate] = useState<Date | string | null | undefined>(
        project.dueDate
            ? format(project.dueDate, "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd")
    );
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(project.name);
    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: (data: Partial<Project>) => {
            return editProject(project.id, data);
        },
        onSuccess: () => {
            setOpen(false);
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"}>
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                    </DialogTrigger>
                    {/* <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                            if (project.id) deleteProject(project.id);
                        }}
                    >
                        Delete Project
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        mutate.mutate({
                            id: project.id,
                            name,
                            dueDate: dueDate
                                ? new Date(dueDate).toISOString()
                                : undefined,
                        });
                    }}
                >
                    <section className="space-y-2">
                        <Label htmlFor="projectTitle">Project Name</Label>
                        <Input
                            id="projectTitle"
                            name="projectTitle"
                            placeholder="Project Title"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </section>

                    <section className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            min={format(new Date(), "yyyy-MM-dd")}
                            value={
                                dueDate
                                    ? format(dueDate, "yyyy-MM-dd")
                                    : format(new Date(), "yyyy-MM-dd")
                            }
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </section>

                    <input
                        id="projectId"
                        name="projectId"
                        value={project.id}
                        readOnly
                        hidden
                    />
                    <Button type="submit">Edit Project</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ProjectEditForm;
