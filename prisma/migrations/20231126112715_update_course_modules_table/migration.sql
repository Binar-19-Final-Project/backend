/*
  Warnings:

  - You are about to drop the column `total_content` on the `course_modules` table. All the data in the column will be lost.
  - Added the required column `total_chapter` to the `course_modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course_modules` DROP COLUMN `total_content`,
    ADD COLUMN `total_chapter` INTEGER NOT NULL;
