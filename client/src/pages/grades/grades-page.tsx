import { useGetAllModules } from "@/api/modules";

import { NavLink } from "react-router";

function GradesPage() {
    const modules = useGetAllModules();
    return (
        <div>
            <h1>Modules Im taking</h1>
            <ul>
                {modules.data?.map((module) => (
                    <li key={module.id}>
                        <NavLink to={module.id} className={"grid grid-cols-5"}>
                            <div>{module.name}</div>
                            <div>{module.averageGrade ?? "---"}</div>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GradesPage;
