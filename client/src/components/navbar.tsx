import { useGetUser } from "@/api/user";
import { UserCircle2 } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

function Navbar() {
    const userQuery = useGetUser();

    if (userQuery.isLoading) return "....";
    if (!userQuery.data) return "No data";

    const user = userQuery.data;

    return (
        <header className="p-2.5 border-b mb-2">
            <ul className="flex justify-end gap-x-5 items-end">
                <li>
                    <ModeToggle />
                </li>
                <li>
                    <div className="text-xs text-muted-foreground">XP</div>
                    <div>{user.totalXp}</div>
                </li>
                <li className="bg-muted py-2 max-w-44 px-2.5 rounded-lg flex gap-x-2.5">
                    <div>{user.name}</div>
                    <UserCircle2 />
                </li>
            </ul>
        </header>
    );
}

export default Navbar;
