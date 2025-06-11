import { useGetAllStudySessions } from "@/api/study-session";
import ChartBarStacked from "./bar-chart";
import { getBarChartConfig, getBarChartData } from "./utils";
import { useGetAllModules } from "@/api/modules";

function DashboardPage() {
    const studySessions = useGetAllStudySessions();
    const modules = useGetAllModules();
    if (studySessions.isLoading) return "...";
    if (modules.isLoading) return "...";
    if (!studySessions.data) return "No session Data";

    const chartData = getBarChartData(studySessions.data);
    const chartConfig = modules.data && getBarChartConfig(modules.data);

    return (
        <div>
            <div className="max-h-52">
                <ChartBarStacked
                    chartData={chartData}
                    chartConfig={chartConfig}
                    modules={modules.data}
                />
            </div>
        </div>
    );
}

export default DashboardPage;
