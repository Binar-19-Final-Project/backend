/*
  Warnings:

  - You are about to drop the column `course_id` on the `course_contents` table. All the data in the column will be lost.
  - Added the required column `course_module_id` to the `course_contents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `course_contents` DROP FOREIGN KEY `course_contents_course_id_fkey`;

-- AlterTable
ALTER TABLE `course_contents` DROP COLUMN `course_id`,
    ADD COLUMN `course_module_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `course_contents` ADD CONSTRAINT `course_contents_course_module_id_fkey` FOREIGN KEY (`course_module_id`) REFERENCES `course_modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
