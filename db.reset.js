const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
     /* Reset database before run seeder */
      /* Delete all data in table */
      await prisma.$transaction([prisma.user.deleteMany()])
      await prisma.$transaction([prisma.role.deleteMany()])
      await prisma.$transaction([prisma.courseCategory.deleteMany()])
      await prisma.$transaction([prisma.courseType.deleteMany()])
      await prisma.$transaction([prisma.courseLevel.deleteMany()])
      await prisma.$transaction([prisma.courseInstructor.deleteMany()])
      await prisma.$transaction([prisma.coursePromo.deleteMany()])
      await prisma.$transaction([prisma.course.deleteMany()])
      await prisma.$transaction([prisma.courseModule.deleteMany()])
      await prisma.$transaction([prisma.courseContent.deleteMany()])
      await prisma.$transaction([prisma.courseTestimonial.deleteMany()])
      await prisma.$transaction([prisma.order.deleteMany()])
      await prisma.$transaction([prisma.userCourse.deleteMany()])
      await prisma.$transaction([prisma.userLearningProgress.deleteMany()])
        /* Reset ID to 1 again */
      await prisma.$queryRaw`ALTER TABLE users AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE roles AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE course_categories AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE course_types AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE course_levels AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE course_instructors AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE course_promos AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE courses AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE course_modules AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE course_contents AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE course_contents AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE orders AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE user_courses AUTO_INCREMENT = 1`
      await prisma.$queryRaw`ALTER TABLE user_learning_progresses AUTO_INCREMENT = 1`
    console.log("Database reset completed.");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
