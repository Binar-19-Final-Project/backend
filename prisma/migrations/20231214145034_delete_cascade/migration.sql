-- DropForeignKey
ALTER TABLE `user_learning_progresses` DROP FOREIGN KEY `user_learning_progresses_content_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_learning_progresses` DROP FOREIGN KEY `user_learning_progresses_user_course_id_fkey`;

-- AddForeignKey
ALTER TABLE `user_learning_progresses` ADD CONSTRAINT `user_learning_progresses_content_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `course_contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_learning_progresses` ADD CONSTRAINT `user_learning_progresses_user_course_id_fkey` FOREIGN KEY (`user_course_id`) REFERENCES `user_courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
