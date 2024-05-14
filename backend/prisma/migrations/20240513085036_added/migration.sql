/*
  Warnings:

  - Added the required column `notificationId` to the `Replies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Replies" ADD COLUMN     "notificationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "Replies_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
