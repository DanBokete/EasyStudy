import { useState, type ReactNode } from "react";
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

import type { Grade } from "@/types/types";
import EditGradeForm from "./edit-grade-form";

interface EditGradeProps {
    children?: ReactNode;
    grade: Grade;
}

function EditGrade({ children, grade }: EditGradeProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button variant={"ghost"} className="ml-auto">
                        <Edit />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Grade</DialogTitle>
                    <DialogDescription>
                        Edit grade information
                    </DialogDescription>
                </DialogHeader>
                <EditGradeForm grade={grade} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}

export default EditGrade;
