import { Calendar, FolderOpen, Home, Inbox, Settings } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "react-router";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Tasks",
        url: "/tasks",
        icon: Inbox,
    },
    {
        title: "...",
        url: "/",
        icon: Calendar,
    },
    {
        title: "Projects",
        url: "/projects",
        icon: FolderOpen,
        subMenu: [{ title: "Amazing", url: "" }],
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
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

                                    {item.subMenu &&
                                        item.subMenu.map((subItem) => (
                                            <SidebarMenuSub key={subItem.title}>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                    >
                                                        <Link to={subItem.url}>
                                                            {subItem.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        ))}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarTrigger />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    );
}
