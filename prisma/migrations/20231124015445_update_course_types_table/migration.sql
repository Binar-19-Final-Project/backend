/*
  Warnings:

  - You are about to drop the column `type` on the `course_types` table. All the data in the column will be lost.
  - Added the required column `name` to the `course_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course_types` DROP COLUMN `type`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
