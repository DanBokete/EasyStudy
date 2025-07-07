import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import SubjectCombobox from "./module-combobox";
import { Play, StopCircle } from "lucide-react";
import { useCreateStudySession } from "@/api/study-session";

const formSchema = z.object({
    title: z.string().trim().min(1, "A title is required"),
    subjectId: z.string().min(1, "Subject is required"),
});
interface TimeTrackFormProps {
    subjectId?: string;
}
export default function TimeTrackForm({ subjectId }: TimeTrackFormProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timer, setTimer] = useState(0);

    // Selecting Subjects

    const createStudySession = useCreateStudySession();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            subjectId: subjectId ?? "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        if (!startTime) return;
        const data = {
            activity: values.title ? values.title : undefined,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date().toISOString(),
            subjectId: values.subjectId,
        };

        createStudySession.mutate(data);

        setIsPlaying(false);
        setStartTime(null);
        setTimer(0);
        form.reset();
        console.log(values);
    }

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

    const seconds = Math.floor(timer);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const displayedSeconds = (seconds % 60).toString().padStart(2, "0");
    const displayedMinutes = (minutes % 60).toString().padStart(2, "0");
    const displayedHours = hours.toString().padStart(2, "0");
    const displayedTimer = `${displayedHours}:${displayedMinutes}:${displayedSeconds}`;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 flex gap-x-2"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className={`w-full`}>
                            <FormControl>
                                <Input
                                    placeholder="What are you doing?"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!subjectId && (
                    <FormField
                        control={form.control}
                        name="subjectId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <SubjectCombobox
                                        {...field}
                                        onChange={(val) => {
                                            field.onChange(val);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <span className="w-36 text-center border py-1 rounded-lg h-fit">
                    {displayedTimer}
                </span>

                <div className="flex">
                    {isPlaying ? (
                        <Button variant={"outline"} type="submit">
                            <StopCircle />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant={"outline"}
                            onClick={(e) => {
                                e.preventDefault();
                                onPlay();
                            }}
                        >
                            <Play />
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}
