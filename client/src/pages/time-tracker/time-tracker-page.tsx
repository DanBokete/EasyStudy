import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FolderClosed, MoreHorizontal, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

function TimeTrackerPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let intervalId: string | number | NodeJS.Timeout | undefined;

        if (isPlaying) {
            intervalId = setInterval(() => {
                const time = (Date.now() - startTime) / 1000;
                console.log(startTime);

                if (time) setTimer(time);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isPlaying, startTime]);

    function onPlay() {
        setStartTime(Date.now());
        setIsPlaying(true);
    }

    const seconds = Math.floor(timer);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const displayedSeconds = (seconds % 60).toString().padStart(2, "0");
    const displayedMinutes = (minutes % 60).toString().padStart(2, "0");
    const displayedHours = hours.toString().padStart(2, "0");
    const displayedTimer = `${displayedHours}:${displayedMinutes}:${displayedSeconds}`;

    return (
        <div>
            <div className="border p-2.5 rounded-lg">
                <div className="flex items-center gap-x-2.5">
                    <Input placeholder="What are you doing?" />
                    <Button variant={"ghost"}>
                        <FolderClosed />
                    </Button>
                    <span className="w-36 text-center border py-1 rounded-lg">
                        {displayedTimer}
                    </span>
                    <Button variant={"outline"} onClick={onPlay}>
                        {isPlaying ? <Pause /> : <Play />}
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
