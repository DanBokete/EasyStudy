import type { Project } from "@/types/types";

export function getArchivedProjects(projects: Project[]): Project[] {
    return projects
        .filter((project) => project.status === "ARCHIVED")
        .sort(
            (a, b) =>
                new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        );
}

export function getUnarchivedProjects(projects: Project[]): Project[] {
    return projects.filter((project) => project.status !== "ARCHIVED");
}
