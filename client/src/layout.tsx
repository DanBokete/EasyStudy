import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet, useLocation } from "react-router";
import Navbar from "./components/navbar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
    const route = useLocation();
    return (
        <>
            <SidebarProvider>
                {route.pathname !== "/login" &&
                    route.pathname !== "/signup" && <AppSidebar />}
                <div className="w-full">
                    {route.pathname !== "/login" &&
                        route.pathname !== "/signup" && <Navbar />}
                    <div className="container max-w-7xl px-5 mt-5 lg:mx-auto">
                        <Outlet />
                    </div>
                </div>
            </SidebarProvider>
            <Toaster />
        </>
    );
}
