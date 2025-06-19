import { useGetGradesByModule } from "@/api/grades";
import { useGetModule } from "@/api/modules";
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
import { useLoaderData } from "react-router";

function GradePage() {
    const moduleId: string = useLoaderData();
    const module = useGetModule(moduleId);
    const grades = useGetGradesByModule(moduleId);

    useEffect(() => {
        module.refetch();
    }, [grades.data, module]);
    if (module.isLoading) return "....";
    if (module.error || !module.data) return "Module failed to load";
    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <h1>Your Grade</h1>
                    <div>Module {module.data.name}</div>
                </div>
                <div>
                    <NewGrade module={module.data} />
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
                            {module.data.averageGrade}%
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default GradePage;
