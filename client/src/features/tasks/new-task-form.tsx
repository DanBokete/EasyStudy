import { useCreateTask } from "@/api/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Project, TaskStatus } from "@/types/types";
import { format } from "date-fns";
import { useState } from "react";

interface NewTaskFormProps {
    project?: Project;
    projects: Project[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    status?: TaskStatus;
}

function NewTaskForm({ project, projects, status }: NewTaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState<string | null>(null);
    const [dueDate, setDueDate] = useState<string>(
        format(new Date(), "yyyy-MM-dd")
    );
    const [time, setTime] = useState<string | null>(null);
    const [projectId, setProjectId] = useState(project ? project.id : "");
    const [newStatus, setNewStatus] = useState<TaskStatus>(status ?? "TODO");

    const mutateTask = useCreateTask();

    return (
        <form
            className="space-y-2"
            onSubmit={(e) => {
                e.preventDefault();

                mutateTask.mutate({
                    title,
                    description,
                    status: newStatus,
                    projectId,
                    dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                    time,
                });
            }}
        >
            <section className="space-y-2">
                <Label htmlFor="name">Title</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </section>

            <section className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    name="description"
                    type="text"
                    value={description ?? ""}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </section>

            <section className="space-y-2">
                <Label>Projects</Label>
                <Select
                    defaultValue={projectId}
                    onValueChange={setProjectId}
                    name="projectId"
                    required
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Projects" />
                    </SelectTrigger>
                    <SelectContent>
                        {projects &&
                            projects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </section>

            <div className="flex gap-x-2">
                <section className="space-y-2 flex-1">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        value={format(dueDate, "yyyy-MM-dd")}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </section>
                <section className="space-y-2 ">
                    <Label>Status</Label>
                    <Select
                        defaultValue={status ?? newStatus}
                        onValueChange={(value: TaskStatus) =>
                            setNewStatus(value)
                        }
                        name="status"
                        required
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BACKLOG">BACKLOG</SelectItem>
                            <SelectItem value="TODO">TODO</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                                IN PROGRESS
                            </SelectItem>
                            <SelectItem value="DONE">DONE</SelectItem>
                        </SelectContent>
                    </Select>
                </section>
            </div>

            <div>
                <section>
                    <Label htmlFor="time">Time</Label>
                    <Input
                        id="time"
                        name="time"
                        type="time"
                        value={time ?? format(new Date(), "hh:mm")}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </section>
            </div>

            <div className="flex gap-x-2 justify-end">
                {/* <Button onSubmit={(e) => deleteTask(e)} variant={"destructive"}>
                    Delete
                </Button> */}
                <Button type="submit">Create Task</Button>
            </div>
        </form>
    );
}

export default NewTaskForm;
