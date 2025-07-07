import {
    Archive,
    Book,
    Clock4,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Plus,
    X,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { Link, NavLink } from "react-router";
import { SITE_NAME } from "@/constants";
import { useGetAllProjects } from "@/api/projects";
import NewProject from "@/features/projects/new-project";
import { Button } from "./ui/button";
import { useLogoutUser } from "@/api/auth/logout";
import { format } from "date-fns";
import { hasDueDatePassed } from "@/helpers/helpers";
import type { Project } from "@/types/types";
import { useCreateSubject, useGetAllSubjects } from "@/api/subject";
import { Input } from "./ui/input";
import { useState } from "react";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Study",
        url: "/study",
        icon: Clock4,
    },

    // { title: "Grades", url: "/grades", icon: GraduationCap },
    // { title: "Archived Projects", url: "/archived-projects", icon: Archive },
];

export function AppSidebar() {
    const useLogoutMutation = useLogoutUser();
    const { isLoading, error, data: projects } = useGetAllProjects();
    const { state } = useSidebar();

    if (isLoading || !projects) return "loading...";
    if (error) return "err";

    const unarchivedProjects = projects.filter(
        (project) => project.status !== "ARCHIVED"
    );
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{SITE_NAME}</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SubjectsGroup />
                {/* <ProjectsGroup
                    state={state}
                    unarchivedProjects={unarchivedProjects}
                /> */}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => useLogoutMutation.mutate()}
                        >
                            <LogOut />
                            Logout
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarTrigger />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
interface ProjectsGroupProps {
    state: "expanded" | "collapsed";
    unarchivedProjects: Project[];
}
function ProjectsGroup({ state, unarchivedProjects }: ProjectsGroupProps) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel asChild />
            <SidebarGroupAction title="Add Project" asChild>
                <NewProject>
                    <Button
                        variant={`${
                            state === "collapsed" ? "outline" : "ghost"
                        }`}
                    >
                        {state === "expanded" && (
                            <div className="text-sidebar-foreground/70">
                                Add Project
                            </div>
                        )}
                        <Plus className="ml-auto" />
                    </Button>
                </NewProject>
            </SidebarGroupAction>
            <SidebarGroupContent>
                <span className="sr-only">Add Project</span>
            </SidebarGroupContent>
            {state === "expanded" && (
                <SidebarGroupContent>
                    <SidebarMenu>
                        {unarchivedProjects.length > 0 ? (
                            unarchivedProjects
                                .sort(
                                    (a, b) =>
                                        new Date(a.dueDate).getTime() -
                                        new Date(b.dueDate).getTime()
                                )
                                .map((project) => {
                                    const isDue = hasDueDatePassed(
                                        project.dueDate
                                    );
                                    return (
                                        <SidebarMenuItem key={project.id}>
                                            <SidebarMenuButton asChild>
                                                <NavLink
                                                    to={`projects/${project.id}`}
                                                    className={
                                                        "justify-between flex"
                                                    }
                                                >
                                                    <span>{project.name}</span>
                                                    <span
                                                        className={`text-sm font-bold ${
                                                            isDue &&
                                                            "text-red-700"
                                                        }`}
                                                    >
                                                        {isDue
                                                            ? "Overdue"
                                                            : format(
                                                                  project.dueDate,
                                                                  "dd/MM"
                                                              )}
                                                    </span>
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })
                        ) : (
                            <SidebarMenuItem>
                                <SidebarMenuButton disabled>
                                    <X />
                                    You have no projects
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </SidebarMenu>
                </SidebarGroupContent>
            )}
        </SidebarGroup>
    );
}

function SubjectsGroup() {
    const [isAddingSubject, setIsAddingSubject] = useState(false);
    const [newSubject, setNewSubject] = useState("");
    const createSubject = useCreateSubject();
    const { data: modules, error, isLoading } = useGetAllSubjects();
    function addSubject() {
        setIsAddingSubject(false);
        if (!modules || !newSubject) return;
        createSubject.mutate({ name: newSubject });
    }
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Subjects</SidebarGroupLabel>
            <SidebarGroupAction onClick={() => setIsAddingSubject(true)}>
                <Plus /> <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
                <SidebarMenu>
                    {isAddingSubject && (
                        <Input
                            value={newSubject}
                            onChange={(e) => {
                                setNewSubject(e.target.value);
                            }}
                            autoFocus
                            onBlur={() => {
                                addSubject();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    addSubject();
                                }
                            }}
                        />
                    )}
                    {createSubject.isPending && (
                        <SidebarMenuItem className="bg-sidebar-accent animate-pulse">
                            <SidebarMenuButton>
                                <Book />
                                <span className="text-sidebar-accent-foreground/50">
                                    {createSubject.variables.name}
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {isLoading && (
                        <div className="h-16 bg-sidebar-accent animate-pulse"></div>
                    )}
                    {modules &&
                        !isLoading &&
                        !error &&
                        modules.map((module) => (
                            <SidebarMenuItem key={module.name}>
                                <SidebarMenuButton asChild>
                                    <Link to={`subjects/${module.id}/overview`}>
                                        <Book />
                                        <span>{module.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    {error && (
                        <div>
                            Failed to load modules,{" "}
                            <Link to={"/login"}>try logging in</Link>
                        </div>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
