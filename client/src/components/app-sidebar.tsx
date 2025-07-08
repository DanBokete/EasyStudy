import { Book, Clock4, LayoutDashboard, LogOut, Plus } from "lucide-react";

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
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { SITE_NAME } from "@/constants";
import { useGetAllProjects } from "@/api/projects";
import { useLogoutUser } from "@/api/auth/logout";
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

    if (isLoading || !projects)
        return (
            <div className="h-screen w-(--sidebar-width) bg-sidebar animate-pulse"></div>
        );
    if (error) return "err";
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
