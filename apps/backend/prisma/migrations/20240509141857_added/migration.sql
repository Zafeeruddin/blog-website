/*
  Warnings:

  - You are about to drop the column `comment` on the `Replies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Replies" DROP COLUMN "comment",
ADD COLUMN     "claps" INTEGER NOT NULL DEFAULT 0;
