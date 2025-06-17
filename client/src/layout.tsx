import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router";

export default function Layout() {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <div className="container max-w-7xl px-5 lg:mx-auto">
                    <header className="py-2 flex justify-end">
                        <div className="flex gap-x-1">
                            <div className="font-bold"></div>
                        </div>
                    </header>

                    <div>
                        <Outlet />
                    </div>
                </div>
            </SidebarProvider>
        </>
    );
}
