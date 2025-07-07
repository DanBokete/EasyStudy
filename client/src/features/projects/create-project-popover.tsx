import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import CreateProjectForm from "./create-project-form";

interface CreateProjectPopoverProps {
    subjectId: string;
}
export default function CreateProjectPopover({
    subjectId,
}: CreateProjectPopoverProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Create Project</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-96">
                <CreateProjectForm subjectId={subjectId} />
            </PopoverContent>
        </Popover>
    );
}
