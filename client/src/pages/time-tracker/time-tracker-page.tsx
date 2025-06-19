import { useGetAllModules } from "@/api/modules";
import {
    useCreateStudySession,
    useGetAllStudySessions,
} from "@/api/study-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ModuleCombobox from "@/features/time-tracker/module-combobox";
import StudySession from "@/features/time-tracker/study-session";
import TimeTrackForm from "@/features/time-tracker/time-tracker-form";
import {
    getDisplayedDuration,
    groupStudySessionByDate,
} from "@/helpers/helpers";
import { format } from "date-fns";
import { Play, StopCircle } from "lucide-react";
import { useEffect, useState } from "react";

function TimeTrackerPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timer, setTimer] = useState(0);
    const [title, setTitle] = useState<string>("");
    const [moduleId, setModuleId] = useState<string | null>("");

    // Selecting Modules
    const [value, setValue] = useState("");

    const studySessions = useGetAllStudySessions();
    const modules = useGetAllModules();
    const createStudySession = useCreateStudySession();

    useEffect(() => {
        let intervalId: string | number | NodeJS.Timeout | undefined;

        if (isPlaying) {
            intervalId = setInterval(() => {
                if (!startTime) return;
                const time = (Date.now() - startTime) / 1000;

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
        if (!timer) return;
        if (!startTime || !moduleId) return;
        const data = {
            activity: title ? title : undefined,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date().toISOString(),
            moduleId,
        };

        createStudySession.mutate(data);

        setIsPlaying(false);
        setStartTime(null);
        setTitle("");
        setTimer(0);
        setModuleId("");
        setValue("");
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

    const groupedStudySessions = groupStudySessionByDate(studySessions.data);
    const studySessionDates = Object.keys(groupedStudySessions).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return (
        <div>
            <div className="border p-2.5 rounded-lg">
                {/* <form
                    className="flex items-center gap-x-2.5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onStop();
                    }}
                >
                    <Input
                        placeholder="What are you doing?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <ModuleCombobox
                        setModuleId={setModuleId}
                        value={value}
                        setValue={setValue}
                    />

                    <span className="w-36 text-center border py-1 rounded-lg">
                        {displayedTimer}
                    </span>
                    {isPlaying ? (
                        <Button variant={"outline"} type="submit">
                            <StopCircle />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant={"outline"}
                            onClick={onPlay}
                        >
                            <Play />
                        </Button>
                    )}
                </form> */}
                <TimeTrackForm />
            </div>

            {studySessionDates.map((date) => {
                const orderedGroupedStudySession = groupedStudySessions[
                    date
                ].sort(
                    (a, b) =>
                        new Date(b.startTime).getTime() -
                        new Date(a.startTime).getTime()
                );
                let totalTimeInSeconds = 0;
                orderedGroupedStudySession.forEach((studySession) => {
                    if (studySession.endTime) {
                        const ms =
                            new Date(studySession.endTime).getTime() -
                            new Date(studySession.startTime).getTime();
                        const totalSeconds = Math.floor(ms / 1000);
                        totalTimeInSeconds += totalSeconds;
                    }
                });

                const formattedDisplayedDuration =
                    getDisplayedDuration(totalTimeInSeconds);
                return (
                    <section
                        key={date}
                        className="p-5 border my-2.5 rounded-xl text-sm"
                    >
                        <div className="flex justify-between">
                            <div className="flex gap-x-1">
                                <h2 className="font-bold mb-2">
                                    {format(date, "dd LLL yyyy")}
                                </h2>
                                <span>
                                    ({orderedGroupedStudySession.length})
                                </span>
                            </div>
                            <div>{formattedDisplayedDuration}</div>
                        </div>
                        <Separator className="mb-2" />
                        <ul>
                            {orderedGroupedStudySession.map((studySession) => {
                                return (
                                    <li key={studySession.id}>
                                        {" "}
                                        <StudySession
                                            studySession={studySession}
                                            modules={modules}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                );
            })}
        </div>
    );
}

export default TimeTrackerPage;
