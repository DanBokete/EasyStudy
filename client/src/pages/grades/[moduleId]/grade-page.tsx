import { useGetGradesByModule } from "@/api/grades";
import { useGetModule } from "@/api/modules";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import NewGrade from "@/features/grades/new-grade";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useLoaderData } from "react-router";

function GradePage() {
    const moduleId: string = useLoaderData();
    const module = useGetModule(moduleId);
    const grades = useGetGradesByModule(moduleId);
    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <h1>Your Grade</h1>
                    <div>Module {module.data?.name}</div>
                </div>
                <div>
                    <NewGrade />
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
                                {Math.floor(
                                    (grade.score / grade.maxScore) * 10000
                                ) / 100}
                                %
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Average</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default GradePage;
