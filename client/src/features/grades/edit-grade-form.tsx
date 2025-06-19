import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Grade } from "@/types/types";
import { useDeleteGrade, useUpdateGrade } from "@/api/grades";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
    id: z.string(),
    title: z
        .string()
        .min(2, { message: "Title must contain at least 2 character(s)" })
        .max(50),
    description: z.string().max(225).optional(),
    date: z.string().date(),
    score: z.coerce.number(),
    maxScore: z.coerce.number().min(1),
});

interface EditGradeFormProps {
    grade: Grade;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditGradeForm({ setOpen, grade }: EditGradeFormProps) {
    const updateGrade = useUpdateGrade();
    const deleteGrade = useDeleteGrade();
    console.log(new Date(grade.date).toLocaleString());

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: grade.id,
            title: grade.title,
            description: grade.description ?? "",
            date: grade.date,
            score: grade.score,
            maxScore: grade.maxScore,
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        updateGrade.mutate(values);
        console.log(values);
        setOpen(false);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="What was the exam?"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="What was the exam?"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                A brief description
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    placeholder="What was the exam?"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                A brief description
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-x-2">
                    <FormField
                        control={form.control}
                        name="score"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Score</FormLabel>
                                <FormControl>
                                    <Input placeholder="0" {...field} />
                                </FormControl>
                                <FormDescription>Your Score</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="maxScore"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Score</FormLabel>
                                <FormControl>
                                    <Input placeholder="100" {...field} />
                                </FormControl>
                                <FormDescription>Max Score</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-between">
                    <Button type="submit" className="flex-auto">
                        Submit
                    </Button>
                    <Button
                        variant={"ghost"}
                        onClick={(e) => {
                            e.preventDefault();
                            deleteGrade.mutate(grade.id);
                        }}
                    >
                        <Trash2 className="text-red-600" />
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default EditGradeForm;
