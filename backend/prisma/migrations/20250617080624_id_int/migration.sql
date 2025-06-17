/*
  Warnings:

  - The primary key for the `refreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `refreshToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "refreshToken" DROP CONSTRAINT "refreshToken_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "refreshToken_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "accessToken" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accessToken_token_key" ON "accessToken"("token");

-- AddForeignKey
ALTER TABLE "accessToken" ADD CONSTRAINT "accessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
