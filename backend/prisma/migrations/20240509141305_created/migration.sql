-- CreateTable
CREATE TABLE "Replies" (
    "id" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Replies_id_key" ON "Replies"("id");

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "Replies_comment_fkey" FOREIGN KEY ("comment") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
