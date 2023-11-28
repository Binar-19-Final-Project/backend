/*
  Warnings:

  - You are about to alter the column `duration` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `taken` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `courses` ADD COLUMN `taken` INTEGER NOT NULL,
    MODIFY `duration` DOUBLE NOT NULL;
