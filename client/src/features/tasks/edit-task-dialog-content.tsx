import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import EditTaskForm from "./edit-task-form";
import type { Task } from "@/types/types";

interface EditTaskDialogContentProps {
    task: Task;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditTaskDialogContent({ task, setOpen }: EditTaskDialogContentProps) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Task Details</DialogTitle>
                <DialogDescription>Edit task details</DialogDescription>
            </DialogHeader>

            <EditTaskForm task={task} setOpen={setOpen} />
        </DialogContent>
    );
}

export default EditTaskDialogContent;
