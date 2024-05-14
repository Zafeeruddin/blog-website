/*
  Warnings:

  - Added the required column `commentId` to the `Replies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Replies" DROP CONSTRAINT "Replies_comment_fkey";

-- AlterTable
ALTER TABLE "Replies" ADD COLUMN     "commentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "Replies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
