/*
  Warnings:

  - You are about to alter the column `rating` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `courses` MODIFY `rating` DOUBLE NOT NULL;
