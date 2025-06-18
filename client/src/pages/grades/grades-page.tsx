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
                        <NavLink to={module.id}>{module.name}</NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GradesPage;
