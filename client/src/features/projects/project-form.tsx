import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { createProject } from "@/api/projects";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function ProjectForm() {
    const [name, setName] = useState("");
    const [dueDate, setDueDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            setOpen(false);
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <Button className="ml-auto">
                    New Project <Plus />
                </Button>
            </DialogTrigger>
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
                            name,
                            dueDate: new Date(dueDate).toISOString(),
                        });
                    }}
                    className="space-y-2"
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
                            value={format(dueDate, "yyyy-MM-dd")}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </section>

                    <Button type="submit">{"Create Project"}</Button>
                    {/* 
                    {state && state.error && (
                        <div className="text-center text-red-600">
                            Failed: {state.error}
                        </div>
                    )} */}
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ProjectForm;
