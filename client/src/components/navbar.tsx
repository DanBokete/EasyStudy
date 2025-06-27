import { useGetUser } from "@/api/user";
import { ChevronDown, UserCircle2 } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

function Navbar() {
    const userQuery = useGetUser();
    const prevXpRef = useRef<number | null>(null);

    useEffect(() => {
        const currentXp = userQuery.data?.totalXp;

        if (typeof currentXp === "number") {
            const prevXp = prevXpRef.current;

            if (prevXp !== null && currentXp > prevXp) {
                toast(`You gained ${currentXp - prevXp} XP!`);
            }

            prevXpRef.current = currentXp;
        }
    }, [userQuery.data?.totalXp]);

    if (userQuery.isLoading) return "....";
    if (!userQuery.data) return "No data";

    const user = userQuery.data;

    return (
        <header className="p-2.5 border-b mb-2">
            <ul className="flex justify-end gap-x-5 items-center">
                <li>
                    <ModeToggle />
                </li>
                <li className="flex items-center gap-x-1">
                    <div className="">{user.totalXp}</div>
                    <div className="text-xs text-muted-foreground">XP</div>
                </li>
                <li className="py-2 max-w-44 px-2.5 rounded-lg flex gap-x-2.5 items-center">
                    <UserCircle2 />
                    <div className="text-sm">{user.name}</div>
                    <ChevronDown className="size-3" />
                </li>
            </ul>
        </header>
    );
}

export default Navbar;
