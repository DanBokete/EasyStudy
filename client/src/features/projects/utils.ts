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

export function getOverdueProjects(projects: Project[]): Project[] {
    const today = new Date().toISOString().split("T")[0];
    return projects.filter(
        (project) =>
            project.dueDate.split("T")[0] <= today &&
            project.status !== "ARCHIVED"
    );
}

export function getUpcomingProjects(projects: Project[]): Project[] {
    const today = new Date().toISOString().split("T")[0];
    return projects
        .filter(
            (project) =>
                project.dueDate.split("T")[0] > today &&
                project.status !== "ARCHIVED"
        )
        .sort(
            (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
}
