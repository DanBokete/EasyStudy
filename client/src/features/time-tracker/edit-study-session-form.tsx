import { useUpdateStudySession } from "@/api/study-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getComputedTimeIsoString } from "@/helpers/helpers";
import type { Subject, StudySession } from "@/types/types";
import { setHours, setMinutes } from "date-fns";
import { useState } from "react";

interface EditStudySessionFormProp {
    studySession: StudySession;
    modules: Subject[] | undefined;
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
    const [subjectId, setSubjectId] = useState(studySession.subjectId);
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
            subjectId,
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
                <Label>Subject</Label>
                <Select
                    defaultValue={studySession.subjectId}
                    onValueChange={(value) => {
                        setSubjectId(value);
                    }}
                >
                    <SelectTrigger className="w-full" size="sm">
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

export default EditStudySessionForm;
