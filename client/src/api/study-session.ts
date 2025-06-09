import api from "@/api";
import type { Project, StudySession } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export async function useGetStudySession(sessionId: string) {
    const response = await api.get(`/study-session/${sessionId}`);
    const project = response.data;
    return project;
}

// export function useEditStudySession(studySessionId: string) {
//     const queryClient = useQueryClient();

//     async function editStudySession(
//         studySessionId: string,
//         data: Partial<StudySession>
//     ) {
//         const response = await api.patch(
//             `/study-sessions/${studySessionId}`,
//             data
//         );

//         const updatedStudySession: StudySession = response.data;

//         return updatedStudySession;
//     }

//     return useMutation({
//         mutationFn: async (data: Partial<StudySession>) =>
//             await editStudySession(studySessionId, data),

//         onMutate: async (updatedStudySession: Partial<StudySession>) => {
//             if (!updatedStudySession.id) return;

//             await queryClient.cancelQueries({
//                 queryKey: ["studySessions", updatedStudySession.id],
//             });

//             const previousStudySession = queryClient.getQueryData([
//                 "studySessions",
//                 updatedStudySession.id,
//             ]);

//             queryClient.setQueryData(
//                 ["studySessions", updatedStudySession.id],
//                 updatedStudySession
//             );

//             return { previousStudySession, updatedStudySession };
//         },

//         onSettled: (updatedStudySession: StudySession | undefined) =>
//             queryClient.invalidateQueries({
//                 queryKey: ["studySessions", updatedStudySession?.id],
//             }),
//     });
// }

async function updateStudySession(data: Partial<StudySession>) {
    const response = await api.patch(`/study-sessions/${data.id}`, data);

    const updatedStudySession: StudySession = response.data;
    return updatedStudySession;
}

export const useUpdateStudySession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateStudySession,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["studySessions", variables.id],
            });
        },
    });
};

export function useGetAllStudySessions() {
    async function getStudySessions() {
        const response = await api.get("/study-sessions");
        const studySession: StudySession[] | [] = response.data;
        console.log(response.data);

        return studySession;
    }
    return useQuery({
        queryKey: ["studySessions"],
        queryFn: getStudySessions,
    });
}

// export async function useCreateStudySession(data: Partial<Project>) {
//     const response = await api.post(`/study-session`, data);
//     const project: Project = response.data;
//     return project;
// }

async function createStudySession(data: Partial<StudySession>) {
    return api.post("/study-sessions", data).then((response) => response.data);
}

export const useCreateStudySession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStudySession,
        onSuccess: (newStudySession) => {
            queryClient.invalidateQueries({ queryKey: ["studySessions"] });

            queryClient.setQueryData(
                ["studySessions"],
                (old: StudySession[]) => [...old, { ...newStudySession }]
            );
        },
    });
};

export async function useDeleteStudySession(projectId: string) {
    const response = await api.delete(`/study-session/${projectId}`);
    const deletedProject: Project = response.data;
    return deletedProject;
}
