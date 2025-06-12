import { useGetAllStudySessions } from "@/api/study-session";
import ChartBarStacked from "./bar-chart";
import { getBarChartConfig, getBarChartData } from "./utils";
import { useGetAllModules } from "@/api/modules";
import { useState } from "react";
import { getEndOfWeek, getStartOfWeek } from "@/helpers/helpers";

function DashboardPage() {
    const [initialDate, setInitialDate] = useState(getStartOfWeek());
    const [finalDate, setFinalDate] = useState(getEndOfWeek());
    const studySessions = useGetAllStudySessions();
    const modules = useGetAllModules();
    if (studySessions.isLoading) return "...";
    if (modules.isLoading) return "...";
    if (!studySessions.data) return "No session Data";
    if (!modules.data) return "No Modules Data";
    console.log(initialDate, finalDate);

    const chartData =
        studySessions.data &&
        getBarChartData(studySessions.data, initialDate, finalDate);
    const chartConfig = modules.data && getBarChartConfig(modules.data);

    return (
        <div>
            <div className="max-h-52">
                <ChartBarStacked
                    chartData={chartData}
                    chartConfig={chartConfig}
                    modules={modules.data}
                    initialDate={initialDate}
                    finalDate={finalDate}
                    setInitialDate={setInitialDate}
                    setFinalDate={setFinalDate}
                />
            </div>
        </div>
    );
}

export default DashboardPage;
