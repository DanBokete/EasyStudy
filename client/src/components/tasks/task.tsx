import { Checkbox } from "../ui/checkbox";

function Task() {
    return (
        <li className="space-y-1">
            <div className="flex gap-x-3">
                <Checkbox className="mt-1.5" />
                <button className="text-left">
                    <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Eveniet nihil, laboriosam deserunt, voluptatibus velit
                        quos aspernatur labore soluta vitae explicabo in libero
                        accusamus eum ipsum. Expedita non asperiores adipisci
                        et!
                    </div>
                    <div className="flex flex-wrap gap-x-2.5 text-sm">
                        <span>Due Date: 12.10.25</span>
                        <span>Subject Name</span>
                    </div>
                </button>
            </div>
        </li>
    );
}

export default Task;
