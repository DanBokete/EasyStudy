import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useCreateUser } from "@/api/auth/signup";

const formSchema = z
    .object({
        username: z
            .string({ required_error: "Please fill in this field." })
            .min(1, { message: "Please fill in this field." })
            .email({
                message:
                    "Please enter a valid email address (Ex: johndoe@domain.com).",
            }),
        name: z
            .string({ required_error: "Please fill in this field." })
            .trim()
            .min(4, { message: "Display Name must be 4 characters long" }),
        password: z
            .string({ required_error: "Please fill in this field." })
            .trim()
            .min(8, { message: "Must be a minimum of 8 characters." })
            .regex(/[A-Z]/, {
                message: "Must include at least one uppercase letter.",
            })
            .regex(/[a-z]/, {
                message: "Must include at least one lowercase letter.",
            })
            .regex(/[0-9]/, { message: "Must include at least one number." })
            .regex(/[^A-Za-z0-9]/, {
                message: "Must include at least one special character.",
            }),
        confirmPassword: z.string({
            required_error: "Please fill in this field.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Your passwords don't match",
        path: ["confirmPassword"],
    });

export function SignupForm() {
    const createUserMutation = useCreateUser();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        createUserMutation.mutate(values);
        console.log(values);
    }
    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>
                    Login with your Apple or Google account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Displayed Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            autoComplete="username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            autoComplete="email"
                                            placeholder="johndoe@domain.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Password"
                                            type="password"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Confirm password"
                                            type="password"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={createUserMutation.isPending}
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
                <div>
                    {createUserMutation.isError && (
                        <div className="text-center text-red-500">
                            {createUserMutation.error.message}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
