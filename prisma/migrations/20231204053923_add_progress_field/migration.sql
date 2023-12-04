/*
  Warnings:

  - Added the required column `progress` to the `user_courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_courses` ADD COLUMN `progress` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user_learning_progresses` MODIFY `progress` INTEGER NOT NULL;
