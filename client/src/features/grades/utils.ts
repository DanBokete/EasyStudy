import type { Grade } from "@/types/types";

export function getAverageGrades(grades: Grade[]) {
    let sumOfGrades = 0;
    const numberOfGrades = grades.length;
    grades.forEach((grade) => {
        sumOfGrades += grade.score / grade.maxScore;
    });
    return Math.floor((sumOfGrades / numberOfGrades) * 10000) / 100;
}

export function getAverageGrade(grade: Grade) {
    return Math.floor((grade.score / grade.maxScore) * 10000) / 100;
}
