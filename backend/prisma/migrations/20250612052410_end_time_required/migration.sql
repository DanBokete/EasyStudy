/*
  Warnings:

  - Made the column `endTime` on table `StudySession` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "StudySession" ALTER COLUMN "endTime" SET NOT NULL,
ALTER COLUMN "endTime" SET DEFAULT CURRENT_TIMESTAMP;
