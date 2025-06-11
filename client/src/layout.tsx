import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Link, Outlet } from "react-router";
import { Button } from "./components/ui/button";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    useUser,
} from "@clerk/clerk-react";

export default function Layout() {
    const user = useUser();
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <div className="container max-w-7xl px-5 lg:mx-auto">
                    <header className="py-2 flex justify-end">
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <div className="flex gap-x-1">
                                <div className="font-bold">
                                    {user.user?.fullName}
                                </div>
                                <UserButton />
                            </div>
                        </SignedIn>
                    </header>

                    <div>
                        <Outlet />
                    </div>
                </div>
            </SidebarProvider>
        </>
    );
}
