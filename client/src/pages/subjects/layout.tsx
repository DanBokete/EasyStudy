import { useGetModule } from "@/api/subject";
import { NavLink, Outlet, useLoaderData } from "react-router";

export default function SubjectPageLayout() {
    const subjectId = useLoaderData() as string;

    const { data, error, isPending } = useGetModule(subjectId);

    if (!data || isPending) return "loading";
    if (error) return "error";

    return (
        <div className="space-y-2">
            <h1 className="text-3xl font-semibold">{data.name}</h1>
            <div className="text-accent-foreground/80">{data.description}</div>

            <div className="border w-fit rounded py-2">
                <NavLink
                    to="overview"
                    className={({ isActive }) =>
                        `${
                            isActive ? "bg-accent/80" : ""
                        } p-2 rounded-l hover:bg-accent/80`
                    }
                >
                    Overview
                </NavLink>

                <NavLink
                    to="projects"
                    className={({ isActive }) =>
                        `${
                            isActive ? "bg-accent/80" : ""
                        } p-2 hover:bg-accent/80`
                    }
                >
                    Projects
                </NavLink>
                <NavLink
                    to="study"
                    className={({ isActive }) =>
                        `${
                            isActive ? "bg-accent/80" : ""
                        } p-2 hover:bg-accent/80`
                    }
                >
                    Study
                </NavLink>
                <NavLink
                    to="grades"
                    className={({ isActive }) =>
                        `${
                            isActive ? "bg-accent/80" : ""
                        } p-2 hover:bg-accent/80`
                    }
                >
                    Grades
                </NavLink>
            </div>

            <Outlet />
            {/* 
            <div>
                <SubjectOverview subjectOverview={data} />
            </div>
            <div>
                <ProjectsTab subjectId={data.subjectId} />
            </div> */}
        </div>
    );
}
