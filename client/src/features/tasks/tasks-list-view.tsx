import type { Task as TaskType } from "@/types/types";
import Task from "./task";

interface TasksListViewProps {
    tasks: TaskType[];
}
function TasksListView({ tasks }: TasksListViewProps) {
    return (
        <div>
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
