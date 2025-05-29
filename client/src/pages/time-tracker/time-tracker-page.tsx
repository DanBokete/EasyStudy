import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FolderClosed, MoreHorizontal, Play } from "lucide-react";

function TimeTrackerPage() {
    return (
        <div>
            <div className="border p-2.5 rounded-lg">
                <div className="flex items-center gap-x-2.5">
                    <Input placeholder="What are you doing?" />
                    <Button variant={"ghost"}>
                        <FolderClosed />
                    </Button>
                    <span>00:00:00</span>
                    <Button variant={"outline"}>
                        <Play />
                    </Button>
                </div>
            </div>

            <section className="p-5 border my-2.5 rounded-xl">
                <h2 className="font-bold mb-2">This week: 05:56 min</h2>
                <Separator className="mb-2" />
                <ul>
                    <li className="grid grid-cols-11 items-center">
                        <div className="col-span-6">
                            Studying how to create my own models{" "}
                        </div>
                        <Badge
                            variant={"outline"}
                            className="space-x-0.5 col-span-2"
                        >
                            <FolderClosed />
                            <span>Personal</span>
                        </Badge>
                        <div className="mx-auto">20:10 - 20:34</div>
                        <span className="mx-auto">00:24:14</span>
                        <Button variant={"ghost"} className="w-fit mx-auto">
                            <MoreHorizontal />
                        </Button>
                    </li>
                    <li className="grid grid-cols-11 items-center">
                        <div className="col-span-6 line-clamp-1">
                            Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Nihil quia veniam voluptates voluptatibus
                            temporibus officia earum nisi error explicabo beatae
                            sequi at expedita impedit, quod velit qui inventore
                            vel ut.
                        </div>
                        <Badge
                            variant={"outline"}
                            className="space-x-0.5 col-span-2 max-w-full"
                        >
                            <FolderClosed />
                            <span className="line-clamp-1">
                                World Domination Is an Honour
                            </span>
                        </Badge>
                        <div className="mx-auto">20:10 - 20:34</div>
                        <span className="mx-auto">00:24:14</span>
                        <Button variant={"ghost"} className="w-fit mx-auto">
                            <MoreHorizontal />
                        </Button>
                    </li>
                </ul>
            </section>
        </div>
    );
}

export default TimeTrackerPage;
