export async function getProject(projectId: string) {
    return {
        id: projectId,
        name: "Finish Sites",
        description: "Very Important",
        dueDate: new Date().toISOString(),
        tasks: [],
    };
}
