import { useGetAllStudySessions } from "@/api/study-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
    FolderClosed,
    MoreHorizontal,
    Pause,
    Play,
    StopCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

function TimeTrackerPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timer, setTimer] = useState(0);
    const [title, setTitle] = useState("");

    const studySessions = useGetAllStudySessions();

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

    function onStop() {
        console.log({ timer, title });
        setIsPlaying(false);
    }

    const seconds = Math.floor(timer);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const displayedSeconds = (seconds % 60).toString().padStart(2, "0");
    const displayedMinutes = (minutes % 60).toString().padStart(2, "0");
    const displayedHours = hours.toString().padStart(2, "0");
    const displayedTimer = `${displayedHours}:${displayedMinutes}:${displayedSeconds}`;

    if (studySessions.isPending) {
        return "Loading...";
    }

    if (!studySessions.data) {
        return "You have not study sessions";
    }

    return (
        <div>
            <div className="border p-2.5 rounded-lg">
                <div className="flex items-center gap-x-2.5">
                    <Input
                        placeholder="What are you doing?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Button variant={"ghost"}>
                        <FolderClosed />
                    </Button>
                    <span className="w-36 text-center border py-1 rounded-lg">
                        {displayedTimer}
                    </span>
                    {isPlaying ? (
                        <Button variant={"outline"} onClick={onStop}>
                            <StopCircle />
                        </Button>
                    ) : (
                        <Button variant={"outline"} onClick={onPlay}>
                            <Play />
                        </Button>
                    )}
                </div>
            </div>

            <section className="p-5 border my-2.5 rounded-xl">
                <h2 className="font-bold mb-2">This week: 05:56 min</h2>
                <Separator className="mb-2" />
                <ul>
                    {studySessions.data.map((studySession) => {
                        return (
                            <li
                                key={studySession.id}
                                className="grid grid-cols-11 items-center"
                            >
                                <div className="col-span-6">
                                    {studySession.activity}
                                </div>
                                <Badge
                                    variant={"outline"}
                                    className="space-x-0.5 col-span-2"
                                >
                                    <FolderClosed />
                                    <span>{studySession.moduleId}</span>
                                </Badge>
                                <div className="mx-auto">
                                    {format(studySession.startTime, "HH:mm")} -
                                    {studySession.endTime
                                        ? format(studySession.endTime, "HH:mm")
                                        : "--:--"}
                                </div>
                                <span className="mx-auto">00:24:14</span>
                                <Button
                                    variant={"ghost"}
                                    className="w-fit mx-auto"
                                >
                                    <MoreHorizontal />
                                </Button>
                            </li>
                        );
                    })}
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
