/*
  Warnings:

  - You are about to drop the column `background` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `button` on the `themes` table. All the data in the column will be lost.
  - Added the required column `backgroundId` to the `themes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buttonId` to the `themes` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password_hash` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "themes" DROP COLUMN "background",
DROP COLUMN "button",
ADD COLUMN     "backgroundId" TEXT NOT NULL,
ADD COLUMN     "buttonId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password_hash" SET NOT NULL;

-- CreateTable
CREATE TABLE "backgrounds" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT NOT NULL,
    "image" TEXT,
    "poster" TEXT,
    "style" TEXT NOT NULL,

    CONSTRAINT "backgrounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buttons" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "text_color" TEXT NOT NULL,

    CONSTRAINT "buttons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_backgroundId_fkey" FOREIGN KEY ("backgroundId") REFERENCES "backgrounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_buttonId_fkey" FOREIGN KEY ("buttonId") REFERENCES "buttons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
