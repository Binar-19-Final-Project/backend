/*
  Warnings:

  - You are about to drop the column `rating` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `taken` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the `course_requirements` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `requirements` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `course_requirements` DROP FOREIGN KEY `course_requirements_course_id_fkey`;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `rating`,
    DROP COLUMN `taken`,
    ADD COLUMN `requirements` TEXT NOT NULL;

-- DropTable
DROP TABLE `course_requirements`;
