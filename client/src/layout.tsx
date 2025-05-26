import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router";
import { Button } from "./components/ui/button";

export default function Layout() {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main className="grid grid-cols-12 w-full">
                    {/* <div className="flex justify-between px-10 col-span-full">
                        <Button variant={"outline"}>Your Name</Button>
                    </div> */}

                    <div className="col-span-10">
                        <Outlet />
                    </div>
                </main>
            </SidebarProvider>
        </>
    );
}
