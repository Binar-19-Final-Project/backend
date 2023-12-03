/*
  Warnings:

  - You are about to drop the column `total_chapter` on the `course_modules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_courses` DROP FOREIGN KEY `user_courses_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_courses` DROP FOREIGN KEY `user_courses_user_id_fkey`;

-- AlterTable
ALTER TABLE `course_modules` DROP COLUMN `total_chapter`;

-- AddForeignKey
ALTER TABLE `user_courses` ADD CONSTRAINT `user_courses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_courses` ADD CONSTRAINT `user_courses_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
