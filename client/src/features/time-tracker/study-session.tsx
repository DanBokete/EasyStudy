import {
    useDeleteStudySession,
    useUpdateStudySession,
} from "@/api/study-session";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getComputedTimeIsoString,
    getDisplayedDurationFromDate,
} from "@/helpers/helpers";
import type { Module, StudySession as StudySessionType } from "@/types/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { format, setHours, setMinutes } from "date-fns";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import EditStudySessionForm from "./edit-study-session-form";

function StudySession({
    studySession,
    modules,
}: {
    studySession: StudySessionType;
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

export default StudySession;
