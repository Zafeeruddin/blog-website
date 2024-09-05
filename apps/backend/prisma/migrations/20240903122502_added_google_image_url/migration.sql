/*
  Warnings:

  - A unique constraint covering the columns `[googleImage]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleImage" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleImage_key" ON "User"("googleImage");
