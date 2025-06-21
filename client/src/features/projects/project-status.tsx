import { useUpdateProjects } from "@/api/projects";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Project } from "@/types/types";

interface ProjectStatusProps {
    project: Project;
}

function ProjectStatus({ project }: ProjectStatusProps) {
    const projectMutation = useUpdateProjects();
    function updateProject(newStatus: string) {
        projectMutation.mutate({ id: project.id, status: newStatus });
    }
    return (
        <Select defaultValue={project.status} onValueChange={updateProject}>
            <SelectTrigger size="sm" className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Complete</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
        </Select>
    );
}

export default ProjectStatus;
