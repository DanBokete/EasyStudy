import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router";
import Navbar from "./components/navbar";

export default function Layout() {
    return (
        <>
            <SidebarProvider>
                {window.location.pathname !== "/login" && <AppSidebar />}
                <div className="container max-w-7xl px-5 mt-5 lg:mx-auto">
                    {window.location.pathname !== "/login" && <Navbar />}
                    <div>
                        <Outlet />
                    </div>
                </div>
            </SidebarProvider>
        </>
    );
}
