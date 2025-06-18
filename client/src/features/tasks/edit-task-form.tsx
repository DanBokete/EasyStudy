import { editTask } from "@/api/task";
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
import { Textarea } from "@/components/ui/textarea";
import type { Task, TaskStatus } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

function EditTaskForm({
    task,
    setOpen,
}: {
    task: Task;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");
    const [dueDate, setDueDate] = useState(
        task.dueDate
            ? format(task.dueDate, "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd")
    );
    const [status, setStatus] = useState(task.status);
    const [time, setTime] = useState(task.time ?? "00:00");

    const queryClient = useQueryClient();

    const mutateTask = useMutation({
        mutationFn: (data: Partial<Task>) => {
            return editTask(task.id, data);
        },
        onSuccess: () => {
            setOpen(false);
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
    return (
        <form
            className="space-y-2"
            onSubmit={(e) => {
                e.preventDefault();
                mutateTask.mutate({
                    title,
                    description,
                    status,
                    dueDate: new Date(dueDate).toISOString(),
                    time,
                });
            }}
        >
            <section className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="name"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </section>

            <section className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {/* <Input
                    id="description"
                    name="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                /> */}
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
                        defaultValue={task.status}
                        required
                        name="status"
                        onValueChange={(value: TaskStatus) => setStatus(value)}
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
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </section>
            </div>

            <input type="hidden" name="taskId" value={task.id} />

            <div className="flex gap-x-2 justify-end">
                {/* <Button onSubmit={(e) => deleteTask(e)} variant={"destructive"}>
                    Delete
                </Button> */}
                <Button type="submit" disabled={mutateTask.isPending}>
                    Save Changes
                </Button>
            </div>
        </form>
    );
}

export default EditTaskForm;
