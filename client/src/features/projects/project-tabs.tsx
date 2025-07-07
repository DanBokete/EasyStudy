import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback } from "react";
import { Link } from "react-router";
import DataKanban from "../tasks/data-kanban";
import TasksListView from "../tasks/tasks-list-view";
import type { Project, TaskStatus } from "@/types/types";
import { useUpdateManyTasks } from "@/api/task";

interface ProjectTabsProps {
    project: Project;
}
export default function ProjectTabs({ project }: ProjectTabsProps) {
    const useTasks = useUpdateManyTasks();
    const onKanbanChange = useCallback(
        (tasks: { id: string; status: TaskStatus; position: number }[]) => {
            useTasks.mutate(tasks);
            console.log(tasks);
        },
        []
    );

    return (
        <Tabs defaultValue="board">
            <div className="flex justify-between">
                <TabsList>
                    <TabsTrigger value="board">Board</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
                <div>
                    <Button variant={"link"} asChild>
                        <Link to={"/projects"}>View All Projects</Link>
                    </Button>
                </div>
            </div>

            <TabsContent value="board">
                <DataKanban
                    data={project.tasks}
                    onChange={onKanbanChange}
                    project={project}
                />
            </TabsContent>
            <TabsContent value="list">
                <TasksListView tasks={project.tasks} project={project} />
            </TabsContent>
        </Tabs>
    );
}
