import {
    Archive,
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

    { title: "Grades", url: "/grades", icon: GraduationCap },
    { title: "Archived Projects", url: "/archived-projects", icon: Archive },
];

export function AppSidebar() {
    const useLogoutMutation = useLogoutUser();
    const { isLoading, error, data: projects } = useGetAllProjects();
    const { state } = useSidebar();

    if (isLoading) return "loading...";
    if (!projects) return "loading...";
    if (error) return "Error loading data";

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
                                    unarchivedProjects.map((project) => (
                                        <SidebarMenuItem key={project.id}>
                                            <SidebarMenuButton asChild>
                                                <NavLink
                                                    to={`projects/${project.id}`}
                                                    className={
                                                        "justify-between flex"
                                                    }
                                                >
                                                    <span>{project.name}</span>
                                                    <span>
                                                        {format(
                                                            project.dueDate,
                                                            "dd/MM"
                                                        )}
                                                    </span>
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
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
