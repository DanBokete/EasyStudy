import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit2, Trash2 } from "lucide-react";
import { Link, Outlet } from "react-router";

function ProjectsPage() {
    return (
        <div>
            <h1 className="text-xl font-extrabold">Projects</h1>
            <Separator className="mb-2" />

            <ul className="space-y-2">
                <li className="flex justify-between p-5 border rounded items-center">
                    <div>
                        <Link className="font-medium" to="1">
                            Study Stack
                        </Link>
                        <div className="text-sm">Personal Project</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-1.5">
                            <div>Due Date: 12.06.2025</div>
                            <Button>
                                <Edit2 />
                            </Button>
                            <Button variant={"destructive"}>
                                <Trash2 />
                            </Button>
                        </div>
                    </div>
                </li>
                <li className="flex justify-between p-5 border rounded items-center">
                    <Link className="font-medium" to="">
                        Finally publishing this
                    </Link>
                    <div>
                        <div className="flex items-center gap-x-1.5">
                            <div>Due Date: 12.06.2025</div>
                            <Button>
                                <Edit2 />
                            </Button>
                            <Button variant={"destructive"}>
                                <Trash2 />
                            </Button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default ProjectsPage;
