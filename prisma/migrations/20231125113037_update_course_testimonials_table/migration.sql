/*
  Warnings:

  - You are about to drop the column `course_id` on the `course_testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `course_testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `course_testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `course_testimonials` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `course_testimonials` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - A unique constraint covering the columns `[userId,courseId]` on the table `course_testimonials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `course_testimonials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `course_testimonials` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `course_testimonials` DROP FOREIGN KEY `course_testimonials_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `course_testimonials` DROP FOREIGN KEY `course_testimonials_user_id_fkey`;

-- AlterTable
ALTER TABLE `course_testimonials` DROP COLUMN `course_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `courseId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `rating` DOUBLE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `course_testimonials_userId_courseId_key` ON `course_testimonials`(`userId`, `courseId`);

-- AddForeignKey
ALTER TABLE `course_testimonials` ADD CONSTRAINT `course_testimonials_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_testimonials` ADD CONSTRAINT `course_testimonials_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
