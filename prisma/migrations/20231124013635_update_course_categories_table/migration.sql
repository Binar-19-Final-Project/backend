/*
  Warnings:

  - You are about to drop the column `user_id` on the `course_categories` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `course_categories_user_id_key` ON `course_categories`;

-- AlterTable
ALTER TABLE `course_categories` DROP COLUMN `user_id`;
