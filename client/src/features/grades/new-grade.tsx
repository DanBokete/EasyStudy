import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import NewGradeForm from "./new-grade-form";
import type { Subject } from "@/types/types";
import { useState } from "react";
interface NewGradeProps {
    subject: Subject;
}

function NewGrade({ subject }: NewGradeProps) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>
                    <Plus />
                    Add Grade
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Add Grade</DialogTitle>
                <DialogDescription>Add a grade to record</DialogDescription>
                <NewGradeForm module={subject} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}

export default NewGrade;
