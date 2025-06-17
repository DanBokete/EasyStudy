import { editProject } from "@/api/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { useState } from "react";

function ProjectEditForm({ project }: { project: Project }) {
    const [dueDate, setDueDate] = useState<Date | string | null | undefined>(
        project.dueDate
            ? format(project.dueDate, "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd")
    );
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description ?? "");
    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: (data: Partial<Project>) => {
            return editProject(project.id, data);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                mutate.mutate({
                    id: project.id,
                    name,
                    dueDate: dueDate
                        ? new Date(dueDate).toISOString()
                        : undefined,
                    description,
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

            <section className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="dueDate"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </section>

            <Button type="submit">Edit Project</Button>
        </form>
    );
}

export default ProjectEditForm;
