import { useCreateModule, useGetAllModules } from "@/api/modules";
import {
    useCreateStudySession,
    useDeleteStudySession,
    useGetAllStudySessions,
    useUpdateStudySession,
} from "@/api/study-session";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    getComputedTimeIsoString,
    getDisplayedDuration,
    getDisplayedDurationFromDate,
    groupStudySessionByDate,
} from "@/helpers/helpers";
import { cn } from "@/lib/utils";
import type { Module, StudySession } from "@/types/types";
import { Dialog } from "@radix-ui/react-dialog";
import type { UseQueryResult } from "@tanstack/react-query";
import { format, setHours, setMinutes } from "date-fns";
import {
    Check,
    ChevronsUpDown,
    MoreHorizontal,
    Play,
    StopCircle,
    Trash2,
} from "lucide-react";
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

function StudySession({
    studySession,
    modules,
}: {
    studySession: StudySession;
    modules: UseQueryResult<Module[], Error>;
}) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingStartTime, setIsEditingStartTime] = useState(false);
    const [isEditingEndTime, setIsEditingEndTime] = useState(false);
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    useEffect(() => {
        setTitle(studySession.activity);
        setStartTime(format(studySession.startTime, "HH:mm"));
        setEndTime(format(studySession.endTime, "HH:mm"));
    }, [studySession]);

    const updateStudySession = useUpdateStudySession();
    const deleteStudySession = useDeleteStudySession();

    // Doing this from client to reduce server request
    let formatted;
    if (studySession.endTime) {
        formatted = getDisplayedDurationFromDate(
            studySession.startTime,
            studySession.endTime
        );
    }

    function editStartTime(startTime: string) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        setIsEditingStartTime(false);

        if (!timeRegex.test(startTime)) {
            return setStartTime(format(studySession.startTime, "HH:mm"));
        }
        const [hours, minutes] = startTime.split(":").map(Number);
        const newDateTime = setHours(
            setMinutes(new Date(studySession.startTime), minutes),
            hours
        );
        const isoString = newDateTime.toISOString();
        updateStudySession.mutate({
            id: studySession.id,
            startTime: isoString,
        });
    }

    function editEndTime(endTime: string) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        setIsEditingEndTime(false);

        if (!timeRegex.test(endTime)) {
            return studySession.endTime
                ? setEndTime(format(studySession.endTime, "HH:mm"))
                : setEndTime("00:00");
        }
        const [hoursEndTime, minutesEndTime] = endTime.split(":").map(Number);

        const [isoStartString, isoEndString] = getComputedTimeIsoString(
            studySession.startTime.toString(),
            setHours(
                setMinutes(new Date(studySession.endTime), minutesEndTime),
                hoursEndTime
            ).toISOString()
        );

        updateStudySession.mutate({
            id: studySession.id,
            startTime: isoStartString,
            endTime: isoEndString,
        });

        console.log(isoEndString);
    }

    return (
        <div className="grid grid-cols-11 items-center">
            {isEditingTitle ? (
                <Input
                    className="col-span-5"
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
                <Input
                    value={title ? title : "Untitled"}
                    className="col-span-5 shadow-none"
                    onClick={() => setIsEditingTitle(true)}
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        setIsEditingTitle(true);
                    }}
                    readOnly
                />
            )}

            <div className="col-span-2">
                <Select
                    defaultValue={studySession.moduleId}
                    onValueChange={(value) => {
                        updateStudySession.mutate({
                            id: studySession.id,
                            moduleId: value,
                        });
                    }}
                >
                    <SelectTrigger className="w-full" size="sm" hideIcon={true}>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {modules.data?.map((module) => (
                            <SelectItem key={module.id} value={module.id}>
                                {module.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="mx-auto flex col-span-2 items-center text-center">
                {isEditingStartTime ? (
                    <Input
                        onBlur={(e) => {
                            editStartTime(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return;
                            editStartTime(startTime);
                        }}
                        value={startTime}
                        onChange={(e) => {
                            setStartTime(e.target.value);
                        }}
                        autoFocus
                    />
                ) : (
                    <Input
                        className="shadow-none"
                        value={startTime}
                        readOnly
                        onClick={() => setIsEditingStartTime(true)}
                    />
                )}
                -
                {isEditingEndTime ? (
                    <Input
                        onBlur={(e) => {
                            editEndTime(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return;
                            editEndTime(endTime);
                        }}
                        value={endTime}
                        onChange={(e) => {
                            setEndTime(e.target.value);
                        }}
                        autoFocus
                    />
                ) : (
                    <Input
                        className="shadow-none"
                        value={endTime}
                        readOnly
                        onClick={() => setIsEditingEndTime(true)}
                    />
                )}
            </div>
            <span className="mx-auto">{formatted ?? "--"}</span>
            <div className="flex justify-end gap-1">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={"outline"} size={"sm"}>
                            <MoreHorizontal />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Session Details</DialogTitle>
                            <DialogDescription>
                                Edit your study session
                            </DialogDescription>
                        </DialogHeader>
                        <EditStudySessionForm
                            studySession={studySession}
                            modules={modules.data}
                        />
                    </DialogContent>
                </Dialog>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        deleteStudySession.mutate({
                            projectId: studySession.id,
                        })
                    }
                >
                    <Trash2 />
                </Button>
            </div>
        </div>
    );
}

function ModuleCombobox({
    setModuleId,
    setValue,
    value,
}: {
    setModuleId: React.Dispatch<React.SetStateAction<string | null>>;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    value: string;
}) {
    const [open, setOpen] = useState(false);

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
interface EditStudySessionFormProp {
    studySession: StudySession;
    modules: Module[] | undefined;
}
function EditStudySessionForm({
    studySession,
    modules,
}: EditStudySessionFormProp) {
    const [activity, setActivity] = useState(studySession.activity);
    const [startTime, setStartTime] = useState(
        new Date(studySession.startTime).toTimeString().slice(0, 5)
    );
    const [endTime, setEndTime] = useState(() => {
        const date = new Date(studySession.endTime);
        return date.toTimeString().slice(0, 5);
    });
    const [moduleId, setModuleId] = useState(studySession.moduleId);
    const [date, setDate] = useState(
        studySession.startTime.toString().split("T")[0]
    );
    const updateStudySession = useUpdateStudySession();

    function editStudySession() {
        const [hoursStartTime, minutesStartTime] = startTime
            .split(":")
            .map(Number);
        const [hoursEndTime, minutesEndTime] = endTime.split(":").map(Number);
        const newDateTime = setHours(
            setMinutes(new Date(studySession.startTime), minutesStartTime),
            hoursStartTime
        );
        const splitDate = date.split("-");
        newDateTime.setFullYear(
            Number(splitDate[0]),
            Number(splitDate[1]) - 1,
            Number(splitDate[2])
        );
        const _isoStringStartTime = newDateTime.toISOString();
        const [isoStringStartTime, isoStringEndTime] = getComputedTimeIsoString(
            _isoStringStartTime,
            setHours(
                setMinutes(new Date(studySession.endTime), minutesEndTime),
                hoursEndTime
            ).toISOString()
        );

        updateStudySession.mutate({
            id: studySession.id,
            activity,
            startTime: isoStringStartTime,
            endTime: isoStringEndTime,
            moduleId,
        });
    }

    return (
        <form
            className="space-y-2"
            onSubmit={(e) => {
                e.preventDefault();
                editStudySession();
            }}
        >
            <div className="space-y-2">
                <Label>Activity</Label>
                <Input
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Date</Label>
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-x-2 space-y-2">
                <div>
                    <Label>Start Time</Label>
                    <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div>
                    <Label>End Time</Label>
                    <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Module</Label>
                <Select
                    defaultValue={studySession.moduleId}
                    onValueChange={(value) => {
                        setModuleId(value);
                    }}
                >
                    <SelectTrigger className="w-full" size="sm" hideIcon={true}>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {modules?.map((module) => (
                            <SelectItem key={module.id} value={module.id}>
                                {module.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end">
                <Button variant={"outline"} type="submit">
                    Edit Session
                </Button>
            </div>
        </form>
    );
}

export default TimeTrackerPage;
