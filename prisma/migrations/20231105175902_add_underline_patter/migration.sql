/*
  Warnings:

  - You are about to drop the column `backgroundId` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `buttonId` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `themes` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `themes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "themes" DROP CONSTRAINT "themes_backgroundId_fkey";

-- DropForeignKey
ALTER TABLE "themes" DROP CONSTRAINT "themes_buttonId_fkey";

-- DropForeignKey
ALTER TABLE "themes" DROP CONSTRAINT "themes_userId_fkey";

-- AlterTable
ALTER TABLE "themes" DROP COLUMN "backgroundId",
DROP COLUMN "buttonId",
DROP COLUMN "userId",
ADD COLUMN     "background_id" TEXT,
ADD COLUMN     "button_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "backgrounds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_button_id_fkey" FOREIGN KEY ("button_id") REFERENCES "buttons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
