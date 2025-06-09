import { useCreateModule, useGetAllModules } from "@/api/modules";
import {
    useCreateStudySession,
    useGetAllStudySessions,
    useUpdateStudySession,
} from "@/api/study-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { groupStudySessionByDate } from "@/helpers/helpers";
import { cn } from "@/lib/utils";
import type { Module, StudySession } from "@/types/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Check,
    ChevronsUpDown,
    FolderClosed,
    MoreHorizontal,
    Play,
    StopCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

function TimeTrackerPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timer, setTimer] = useState(0);
    const [title, setTitle] = useState<string>("");
    const [moduleId, setModuleId] = useState<string | null>("");

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
                <form
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
                    <ModuleCombobox setModuleId={setModuleId} />

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
                </form>
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
                const hours = String(
                    Math.floor(totalTimeInSeconds / 3600)
                ).padStart(2, "0");
                const minutes = String(
                    Math.floor((totalTimeInSeconds % 3600) / 60)
                ).padStart(2, "0");
                const seconds = String(totalTimeInSeconds % 60).padStart(
                    2,
                    "0"
                );

                const formattedDisplayedDuration = `${hours}:${minutes}:${seconds}`;
                return (
                    <section
                        key={date}
                        className="p-5 border my-2.5 rounded-xl"
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
                                    <li
                                        key={studySession.id}
                                        className="grid grid-cols-11 items-center"
                                    >
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

function StudySession({
    studySession,
    modules,
}: {
    studySession: StudySession;
    modules: UseQueryResult<Module[], Error>;
}) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingStartTime, setIsEditingStartTime] = useState(false);
    const [title, setTitle] = useState(studySession.activity ?? "");
    const [startTime, setStartTime] = useState(
        format(studySession.startTime, "HH:mm")
    );
    const updateStudySession = useUpdateStudySession();

    let formatted;
    if (studySession.endTime) {
        const ms =
            new Date(studySession.endTime).getTime() -
            new Date(studySession.startTime).getTime();
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
            2,
            "0"
        );
        const seconds = String(totalSeconds % 60).padStart(2, "0");

        formatted = `${hours}:${minutes}:${seconds}`;
    }

    return (
        <>
            {isEditingTitle ? (
                <Input
                    className="col-span-6"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => {
                        setIsEditingTitle(false);
                        if (title === studySession.activity) return;
                        updateStudySession.mutate({
                            id: studySession.id,
                            activity: title,
                        });
                    }}
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        setIsEditingTitle(false);
                        if (title === studySession.activity) return;
                        updateStudySession.mutate({
                            id: studySession.id,
                            activity: title,
                        });
                    }}
                    autoFocus
                />
            ) : (
                <button
                    className="col-span-6 text-left"
                    onClick={() => setIsEditingTitle(true)}
                >
                    {title ? title : "Untitled"}
                </button>
            )}
            <Badge variant={"outline"} className="space-x-0.5 col-span-2">
                <FolderClosed />
                <span>
                    {
                        modules.data?.find(
                            (module) => module.id === studySession.moduleId
                        )?.name
                    }
                </span>
            </Badge>
            <div className="mx-auto flex">
                {isEditingStartTime ? (
                    <Input
                        onBlur={(e) => {
                            const time = e.target.value;
                            const [hours] = time.split(":");
                            if (Number(hours) >= 24)
                                setStartTime(
                                    format(studySession.startTime, "HH:mm")
                                );

                            setIsEditingStartTime(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return;
                            setIsEditingStartTime(false);
                        }}
                        value={startTime}
                        onChange={(e) => {
                            setStartTime(e.target.value);
                        }}
                        autoFocus
                    />
                ) : (
                    <button
                        className="text-left"
                        onClick={() => setIsEditingStartTime(true)}
                    >
                        {startTime}
                    </button>
                )}
                -
                <div>
                    {studySession.endTime
                        ? format(studySession.endTime, "HH:mm")
                        : "--"}
                </div>
            </div>
            <span className="mx-auto">{formatted ?? "--"}</span>
            <Button variant={"ghost"} className="w-fit mx-auto">
                <MoreHorizontal />
            </Button>
        </>
    );
}

function ModuleCombobox({
    setModuleId,
}: {
    setModuleId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [name, setName] = useState("");
    const modules = useGetAllModules();
    const createModule = useCreateModule();

    useEffect(() => {
        if (!modules.data) return;
        setModuleId(() => {
            const currentModule = modules.data.find(
                (module) => module.name === value
            );
            if (!currentModule) return null;
            return currentModule.id;
        });
    }, [value]);
    function onCreateModule() {
        createModule.mutate({ name });
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? modules.data?.find((module) => module.name === value)
                              ?.name
                        : "Select Module..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search Module..."
                        className="h-9"
                        onValueChange={(e) => setName(e)}
                    />
                    <CommandList>
                        <CommandEmpty>
                            <Button
                                variant={"outline"}
                                onClick={onCreateModule}
                            >
                                Create Module
                            </Button>
                        </CommandEmpty>
                        <CommandGroup>
                            {modules.data?.map((module) => (
                                <CommandItem
                                    key={module.id}
                                    value={module.name}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );

                                        setOpen(false);
                                    }}
                                >
                                    {module.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === module.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

// function ModuleForm() {
//     const [name, setName] = useState("");
//     const createModule = useCreateModule();
//     function onSubmit() {
//         createModule.mutate({ name });
//     }
//     return (
//         <form
//             className="space-y-2"
//             onSubmit={(e) => {
//                 e.preventDefault();
//                 onSubmit();
//             }}
//         >
//             <Label>Module Name</Label>
//             <Input
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//             />
//             <Button type="submit" className="ml-auto">
//                 Create Module
//             </Button>
//         </form>
//     );
// }

export default TimeTrackerPage;
