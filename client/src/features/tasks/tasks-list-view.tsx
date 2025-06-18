import type { Project, Task as TaskType } from "@/types/types";
import Task from "./task";
import NewTask from "./new-task";

interface TasksListViewProps {
    tasks: TaskType[];
    project: Project;
}
function TasksListView({ tasks, project }: TasksListViewProps) {
    return (
        <div>
            <NewTask project={project} />
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <Task task={task} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TasksListView;
