import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Link, Outlet } from "react-router";
import { Button } from "./components/ui/button";

export default function Layout() {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <div className="container max-w-7xl px-5 lg:mx-auto">
                    <div className="py-2 flex justify-end">
                        <Button variant={"outline"} asChild>
                            <Link to={"/login"}>Login</Link>
                        </Button>
                    </div>

                    <div>
                        <Outlet />
                    </div>
                </div>
            </SidebarProvider>
        </>
    );
}
