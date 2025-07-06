/*
  Warnings:

  - You are about to drop the column `moduleId` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `moduleId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `moduleId` on the `StudySession` table. All the data in the column will be lost.
  - You are about to drop the `Module` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subjectId` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `StudySession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "StudySession" DROP CONSTRAINT "StudySession_moduleId_fkey";

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "moduleId",
ADD COLUMN     "subjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "moduleId",
ADD COLUMN     "subjectId" TEXT;

-- AlterTable
ALTER TABLE "StudySession" DROP COLUMN "moduleId",
ADD COLUMN     "subjectId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Module";

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
