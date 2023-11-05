/*
  Warnings:

  - Added the required column `title` to the `themes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "themes" ADD COLUMN     "title" TEXT NOT NULL;
