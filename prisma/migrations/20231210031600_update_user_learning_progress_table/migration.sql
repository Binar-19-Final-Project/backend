/*
  Warnings:

  - You are about to drop the column `progress` on the `user_learning_progresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `course_requirements` MODIFY `requirements` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `user_learning_progresses` DROP COLUMN `progress`,
    ADD COLUMN `finished_at` DATETIME(3) NULL;
