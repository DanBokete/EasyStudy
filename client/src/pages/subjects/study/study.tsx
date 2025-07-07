import { useGetAllStudySessions } from "@/api/study-session";
import { useGetAllSubjects } from "@/api/subject";
import { Separator } from "@/components/ui/separator";
import StudySession from "@/features/time-tracker/study-session";
import TimeTrackForm from "@/features/time-tracker/time-tracker-form";
import {
    getDisplayedDuration,
    groupStudySessionByDate,
} from "@/helpers/helpers";
import { format } from "date-fns";
import { useParams } from "react-router";

export default function Study() {
    const studySessions = useGetAllStudySessions();
    const subjects = useGetAllSubjects();
    const { subjectId } = useParams();

    if (studySessions.isPending || !studySessions.data) {
        return "Loading...";
    }

    const groupedStudySessions = groupStudySessionByDate(studySessions.data);
    const studySessionDates = Object.keys(groupedStudySessions).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    if (studySessions.isPending) {
        return "Loading...";
    }

    if (!studySessions.data) {
        return "You have not study sessions";
    }
    return (
        <div>
            <div className="border p-2.5 rounded-lg">
                <TimeTrackForm subjectId={subjectId} />
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
                        <ul className="space-y-2.5">
                            {orderedGroupedStudySession.map((studySession) => {
                                return (
                                    <li key={studySession.id}>
                                        {" "}
                                        <StudySession
                                            subjectId={studySession.subjectId}
                                            studySession={studySession}
                                            modules={subjects}
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
