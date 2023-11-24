const db = require('./connection')
const { faker } = require('@faker-js/faker/locale/id_ID')
const bcrypt = require("bcrypt")

/* For create unique data */
const usedRoleName = new Set()
const usedUserId = new Set()
const usedCourseCategoryName = new Set()
const usedCourseType = new Set()
const usedCourseLevel = new Set()
const usedCoursePromoName = new Set()


async function seedData()  {
    /* Reset database before run seeder */
      /* Delete all data in table */
    await db.$transaction([db.user.deleteMany()])
    await db.$transaction([db.role.deleteMany()])
    await db.$transaction([db.photoProfile.deleteMany()])
    await db.$transaction([db.courseCategory.deleteMany()])
    await db.$transaction([db.courseType.deleteMany()])
    await db.$transaction([db.courseLevel.deleteMany()])
    await db.$transaction([db.courseInstructor.deleteMany()])
    await db.$transaction([db.coursePromo.deleteMany()])
      /* Reset ID to 1 again */
    await db.$queryRaw`ALTER TABLE users AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE roles AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE photo_profiles AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_categories AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_types AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_levels AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_instructors AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_promos AUTO_INCREMENT = 1`

    /* Role Seeder */
    for (let i = 0; i < 2; i++) {
        let roleName
        do {
          roleName = faker.helpers.arrayElement(['user', 'admin'])
        } while (usedRoleName.has(roleName))
    
        usedRoleName.add(roleName)
    
        const seedRoles = {
          name: roleName,
        }  
    
        await db.role.create({ data: seedRoles })
    }

    /* User Seeder */
    for (let i = 0; i < 10; i++) {
        const seedUsers = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.number.int({ max: 100000000 }),
            password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10)), 
            verified: faker.datatype.boolean(0.9),
            roleId: faker.number.int({ min: 1, max: 3 }), 
        }
    
        await db.user.create({ data: seedUsers })
    }

    /* Photo Profile Seeder */
    for (let i = 0; i < 10; i++) {
      let userId
        do {
          userId = faker.number.int({ min: 1, max: 10 })
        } while (usedUserId.has(userId))
    
        usedUserId.add(userId)

      const seedPhotoProfiles = {
          urlPhoto: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
          userId: userId, 
      }
  
      await db.photoProfile.create({ data: seedPhotoProfiles })
    }

    /* Course Category Seeder */
    for (let i = 0; i < 5; i++) {
      let courseCategoryName
        do {
          courseCategoryName = faker.helpers.arrayElement(['Product Management', 'UI / UX Design', 'Web Development', 'Android Development', 'iOS Development'])
        } while (usedCourseCategoryName.has(courseCategoryName))

        usedCourseCategoryName.add(courseCategoryName)
      
        const slug = {
          'Product Management': 'product-management',
          'UI / UX Design': 'ui-ux-design',
          'Web Development': 'web-development',
          'Android Development': 'android-development',
          'iOS Development': 'ios-development'
        }

        const courseCategorySlug = slug[courseCategoryName]
    
        const seedCategoryCourse = {
          name: courseCategoryName,
          slug: courseCategorySlug,
        }
  
      await db.courseCategory.create({ data: seedCategoryCourse })
    }

    /* Course Type Seeder */
    for (let i = 0; i < 2; i++) {
      let courseType
        do {
          courseType = faker.helpers.arrayElement(['Free', 'Premium'])
        } while (usedCourseType.has(courseType))
    
        usedCourseType.add(courseType)
    
        const seedCourseType = {
          name: courseType,
        }
  
      await db.courseType.create({ data: seedCourseType })
    }

    /* Course Level Seeder */
    for (let i = 0; i < 3; i++) {
      let courseLevel
        do {
          courseLevel = faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced'])
        } while (usedCourseLevel.has(courseLevel))
    
        usedCourseLevel.add(courseLevel)
    
        const seedCourseLevel = {
          name: courseLevel,
        }
  
      await db.courseLevel.create({ data: seedCourseLevel })
    }

    /* Course Instructor Seeder */
    for (let i = 0; i < 5; i++) {
      const seedInsctructor = {
          name: faker.person.fullName(), 
      }
  
      await db.courseInstructor.create({ data: seedInsctructor })
    } 

    /* Course Promo Seeder */
    for (let i = 0; i < 2; i++) {
      let promoName
      do {
        promoName = faker.helpers.arrayElement(['Special New Year', 'Special Independence Day'])
      } while (usedCoursePromoName.has(promoName))
  
      usedCoursePromoName.add(promoName)
  
      const seedPromos = {
        name: promoName,
        discount: faker.number.int({ min: 5, max: 20 }),
        expiredAt:  faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-03-03T00:00:00.000Z' })
      }  
  
      await db.coursePromo.create({ data: seedPromos })
    } 

    /* Course Data Seeder */
    for (let i = 0; i < 30; i++) {
      
      const seedCourse = {
        title: faker.commerce.productName(),
        slug: faker.lorem.slug(2),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 100000, max: 1000000 }),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
        instructorId: faker.number.int({ min: 1, max: 5 }),
        courseTypeId: faker.number.int({ min: 1, max: 2 }),
        courseCategoryId: faker.number.int({ min: 1, max: 5 }),
        courseLevelId: faker.number.int({ min: 1, max: 3 }),
        coursePromoId: faker.number.int({ min: 1, max: 2 })
      }  
  
      await db.course.create({ data: seedCourse })
    }


    /* Disconnect Prisma Connection */
    await db.$disconnect()
}


/* Run Seeder Function */
seedData()
  .then(() => {
    console.log("============= Seeder Finished =================")
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });

