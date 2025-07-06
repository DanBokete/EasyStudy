import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleOverview from "./overview";

function ModulePage() {
    const data = { subjectName: "dan", subjectDescription: "fjfjhf" };
    return (
        <div className="space-y-2">
            <h1 className="text-3xl font-semibold">{data.subjectName}</h1>
            <div className="text-accent-foreground/80">
                {data.subjectDescription}
            </div>
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="study" disabled>
                        Study
                    </TabsTrigger>
                    <TabsTrigger value="grades" disabled>
                        Grades
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <ModuleOverview />
                </TabsContent>
                <TabsContent value="projects">
                    {/* <ProjectsTab /> */}
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ModulePage;
