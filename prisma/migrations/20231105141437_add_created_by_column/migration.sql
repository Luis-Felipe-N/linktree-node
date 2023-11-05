/*
  Warnings:

  - Added the required column `userId` to the `themes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "themes" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
