import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import NewGradeForm from "./new-grade-form";

function NewGrade() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"}>
                    <Plus />
                    Add Grade
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>Add Grade</DialogHeader>
                <DialogDescription></DialogDescription>
                <NewGradeForm />
            </DialogContent>
        </Dialog>
    );
}

export default NewGrade;
