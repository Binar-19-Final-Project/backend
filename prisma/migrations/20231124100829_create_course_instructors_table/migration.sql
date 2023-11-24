/*
  Warnings:

  - You are about to drop the column `instructor` on the `courses` table. All the data in the column will be lost.
  - Added the required column `instructorId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `courses` DROP COLUMN `instructor`,
    ADD COLUMN `course_promo_id` INTEGER NULL,
    ADD COLUMN `instructorId` INTEGER NOT NULL,
    MODIFY `description` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `course_instructors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `course_instructors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
