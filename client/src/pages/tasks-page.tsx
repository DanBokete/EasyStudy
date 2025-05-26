import Task from "@/components/tasks/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function TasksPage() {
    return (
        <div>
            <form action="" className="my-2 space-y-2.5">
                <Input placeholder={"What needs to be done?"} />
                <div className="flex">
                    <div className="space-x-1.5">
                        <Button variant={"ghost"}>+ Tags</Button>
                        <Button variant={"ghost"}>+ Module</Button>
                    </div>

                    <Button
                        type="submit"
                        variant={"outline"}
                        className="ml-auto"
                    >
                        Add Task
                    </Button>
                </div>
            </form>

            <section>
                <h2>Today</h2>
                <ul className="space-y-2 my-5">
                    <Task />
                    <Task />
                </ul>
            </section>
        </div>
    );
}

export default TasksPage;
