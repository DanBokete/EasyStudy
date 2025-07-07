import { useGetGradesBySubject } from "@/api/grades";
import { useGetSubject } from "@/api/subject";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import EditGrade from "@/features/grades/edit-grade";
import NewGrade from "@/features/grades/new-grade";
import { format } from "date-fns";
import { useEffect } from "react";
import { useRouteLoaderData } from "react-router";

function GradePage() {
    const subjectId = useRouteLoaderData("subjectRouteId") as string;
    const subject = useGetSubject(subjectId);
    const grades = useGetGradesBySubject(subjectId);

    useEffect(() => {
        subject.refetch();
    }, [grades.data, subject]);

    if (subject.isLoading) return "....";
    if (subject.error || !subject.data) return "Subject failed to load";
    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <h1>Your Grade</h1>
                    <div>Subject {subject.data.name}</div>
                </div>
                <div>
                    <NewGrade subject={subject.data} />
                </div>
            </div>

            <Table>
                <TableCaption>A list of your grades.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {grades.data?.map((grade) => (
                        <TableRow key={grade.id}>
                            <TableCell className="font-medium">
                                {grade.title}
                            </TableCell>
                            <TableCell>
                                {format(grade.date, "dd.MM.yyyy")}
                            </TableCell>
                            <TableCell>
                                {grade.score}/{grade.maxScore}
                            </TableCell>
                            <TableCell className="text-right">
                                {grade.percent}%
                            </TableCell>
                            <TableCell>
                                <EditGrade grade={grade} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Average</TableCell>
                        <TableCell className="text-right">
                            {subject.data.averageGrade}%
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default GradePage;
