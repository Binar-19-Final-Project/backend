const db = require('./connection')
const { faker } = require('@faker-js/faker/locale/id_ID')
const bcrypt = require("bcrypt")
const slugify = require('slugify');

/* For create unique data */
const usedRoleName = new Set()
const usedUserId = new Set()
const usedCourseCategoryName = new Set()
const usedCourseType = new Set()
const usedCourseLevel = new Set()
const usedCoursePromoName = new Set()
const existingPairs = new Set();


async function seedData()  {
    /* Reset database before run seeder */
      /* Delete all data in table */
    /* await db.$transaction([db.user.deleteMany()])
    await db.$transaction([db.role.deleteMany()])
    await db.$transaction([db.courseCategory.deleteMany()])
    await db.$transaction([db.courseType.deleteMany()])
    await db.$transaction([db.courseLevel.deleteMany()])
    await db.$transaction([db.courseInstructor.deleteMany()])
    await db.$transaction([db.coursePromo.deleteMany()])
    await db.$transaction([db.course.deleteMany()])
    await db.$transaction([db.courseModule.deleteMany()])
    await db.$transaction([db.courseContent.deleteMany()])
    await db.$transaction([db.courseTestimonial.deleteMany()]) */
    await db.$transaction([db.userCourse.deleteMany()])
      /* Reset ID to 1 again */
    /* await db.$queryRaw`ALTER TABLE users AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE roles AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_categories AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_types AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_levels AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_instructors AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_promos AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE courses AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_modules AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_contents AUTO_INCREMENT = 1`
    await db.$queryRaw`ALTER TABLE course_testimonials AUTO_INCREMENT = 1` */
    await db.$queryRaw`ALTER TABLE user_courses AUTO_INCREMENT = 1`

    // /* Role Seeder */
    // for (let i = 0; i < 2; i++) {
    //     let roleName
    //     do {
    //       roleName = faker.helpers.arrayElement(['user', 'admin'])
    //     } while (usedRoleName.has(roleName))
    
    //     usedRoleName.add(roleName)
    
    //     const seedRoles = {
    //       name: roleName,
    //     }  
    
    //     await db.role.create({ data: seedRoles })
    // }

    // /* User Seeder */
    // for (let i = 0; i < 10; i++) {
    //     const seedUsers = {
    //         name: faker.person.fullName(),
    //         email: faker.internet.email(),
    //         phone: faker.number.int({ max: 100000000 }),
    //         password: bcrypt.hashSync("Password123", bcrypt.genSaltSync(10)),
    //         city: faker.location.city(),
    //         country: faker.location.country(),
    //         photoProfile: "https://img.freepik.com/free-photo/portrait-successful-man-having-stubble-posing-with-broad-smile-keeping-arms-folded_171337-1267.jpg",
    //         verified: true,
    //         roleId: faker.number.int({ min: 1, max: 3 }), 
    //     }
    
    //     await db.user.create({ data: seedUsers })
    // }

    // /* Course Category Seeder */
    // for (let i = 0; i < 6; i++) {
    //   let courseCategoryName
    //     do {
    //       courseCategoryName = faker.helpers.arrayElement(['Product Management', 'UI UX Design', 'Web Development', 'Android Development', 'iOS Development', 'Machine Learning'])
    //     } while (usedCourseCategoryName.has(courseCategoryName))

    //     usedCourseCategoryName.add(courseCategoryName)

    //     const slug = slugify(courseCategoryName, { lower: true, remove: /[*+~.()'"!:@]/g })
    
    //     const seedCategoryCourse = {
    //       name: courseCategoryName,
    //       slug: slug,
    //       urlPhoto: faker.image.urlLoremFlickr({ category: 'business' })
    //     }
  
    //   await db.courseCategory.create({ data: seedCategoryCourse })
    // }

    // /* Course Type Seeder */
    // for (let i = 0; i < 2; i++) {
    //   let courseType
    //     do {
    //       courseType = faker.helpers.arrayElement(['Free', 'Premium'])
    //     } while (usedCourseType.has(courseType))
    
    //     usedCourseType.add(courseType)

    //     const slug = slugify(courseType, { lower: true, remove: /[*+~.()'"!:@]/g })
    
    //     const seedCourseType = {
    //       name: courseType,
    //       slug: slug
    //     }
  
    //   await db.courseType.create({ data: seedCourseType })
    // }

    // /* Course Level Seeder */
    // for (let i = 0; i < 3; i++) {
    //   let courseLevel
    //     do {
    //       courseLevel = faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced'])
    //     } while (usedCourseLevel.has(courseLevel))
    
    //     usedCourseLevel.add(courseLevel)

    //     const slug = slugify(courseLevel, { lower: true, remove: /[*+~.()'"!:@]/g })
    
    //     const seedCourseLevel = {
    //       name: courseLevel,
    //       slug: slug
    //     }
  
    //   await db.courseLevel.create({ data: seedCourseLevel })
    // }

    // /* Course Instructor Seeder */
    // for (let i = 0; i < 5; i++) {

    //   const name = faker.person.fullName()
    //   const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g })
      

    //   const seedInsctructor = {
    //       name: name,
    //       slug: slug,
    //       photoProfile: "https://img.freepik.com/free-photo/portrait-successful-man-having-stubble-posing-with-broad-smile-keeping-arms-folded_171337-1267.jpg",
    //   }
  
    //   await db.courseInstructor.create({ data: seedInsctructor })
    // } 

    // /* Course Promo Seeder */
    // for (let i = 0; i < 2; i++) {
    //   let promoName
    //   do {
    //     promoName = faker.helpers.arrayElement(['Special New Year', 'Special Independence Day'])
    //   } while (usedCoursePromoName.has(promoName))
  
    //   usedCoursePromoName.add(promoName)

    //   const slug = slugify(promoName, { lower: true, remove: /[*+~.()'"!:@]/g })
  
    //   const seedPromos = {
    //     name: promoName,
    //     slug: slug,
    //     discount: faker.number.int({ min: 5, max: 20 }),
    //     expiredAt:  faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-03-03T00:00:00.000Z' })
    //   }  
  
    //   await db.coursePromo.create({ data: seedPromos })
    // } 

    // /* Course Data Seeder */
    // for (let i = 0; i < 30; i++) {

    //   const title = faker.commerce.productName()
    //   const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g })
      
    //   const seedCourse = {
    //     title: title,
    //     slug: slug,
    //     description: faker.commerce.productDescription(),
    //     price: faker.number.int({ min: 100000, max: 1000000 }),
    //     rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    //     taken: faker.number.int({ min: 10, max: 100 }),
    //     imageUrl: "https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg",
    //     courseInstructorId: faker.number.int({ min: 1, max: 5 }),
    //     courseTypeId: faker.number.int({ min: 1, max: 2 }),
    //     courseCategoryId: faker.number.int({ min: 1, max: 5 }),
    //     courseLevelId: faker.number.int({ min: 1, max: 3 }),
    //     isPromo: faker.datatype.boolean(0.2),
    //   }
      
    //   if (seedCourse.isPromo) {
    //     seedCourse.coursePromoId = faker.number.int({ min: 1, max: 2 });
    //   }
  
    //   await db.course.create({ data: seedCourse })
    // }

    // /* Course Module Seeder */
    // for (let i = 0; i < 200; i++) {

    //   const title = faker.commerce.productName()
    //   const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g })

    //   const seedCourseModules = {
    //       title: title,
    //       slug: slug, 
    //       courseId: faker.number.int({ min: 1, max: 30 })
    //   }
  
    //   await db.courseModule.create({ data: seedCourseModules })
    // }

    //  /* Course Content Seeder */
    //  for (let i = 0; i < 1000; i++) {

    //   const title = faker.commerce.productName()
    //   const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g })

    //   const seedCourseContents = {
    //       title: title,
    //       slug: slug,
    //       videoUrl: "https://www.youtube.com/watch?v=VR2C_llrvqk",
    //       sequence: faker.number.int({ min: 1, max: 8 }),
    //       isFree: faker.datatype.boolean(0.7),
    //       duration: faker.number.int({ min: 1, max: 10 }),
    //       moduleId: faker.number.int({ min: 1, max: 200 }),
    //   }
  
    //   await db.courseContent.create({ data: seedCourseContents })
    // }

    // /* Course Testimonial Seeder */
    // for (let i = 0; i < 60; i++) {
    //   let userId = faker.number.int({ min: 1, max: 10 })
    //   let courseId = faker.number.int({ min: 1, max: 30 })
    //   const pair = `${userId}-${courseId}`
    
    //   if (!existingPairs.has(pair)) {
    //     existingPairs.add(pair);
    
    //     const seedCourseTestimonial = {
    //       testimonial: faker.lorem.text(),
    //       rating: faker.number.int({ min: 1, max: 5 }),
    //       userId,
    //       courseId,
    //     };
    
    //     await db.courseTestimonial.create({ data: seedCourseTestimonial });
    //   }
    // }

    /* User Course Seeder */
    for (let i = 0; i < 100; i++) {
      let userId = faker.number.int({ min: 1, max: 10 })
      let courseId = faker.number.int({ min: 1, max: 30 })
      const pair = `${userId}-${courseId}`
    
      if (!existingPairs.has(pair)) {
        existingPairs.add(pair);
    
        const seedUserCourse = {
          userId,
          courseId,
          progress: faker.number.int({ min: 98, max: 100 })
        }


        if(seedUserCourse.progress === 100) {
            seedUserCourse.status = 'Selesai'
        } else {
            seedUserCourse.status = 'In Progress'
        }
    
        await db.userCourse.create({ data: seedUserCourse });
      }
    }

    /* Course Order Seeder */
    // for (let i = 0; i < 60; i++) {
    //   const seedUserOrders = {
    //       orderCode: faker.string.nanoid(),
    //       price: faker.number.int({ min: 100000, max: 1000000 }),
    //       status: faker.helpers.arrayElement(['Success', 'Cancel', 'Pending']),
    //       paymentMethod: faker.helpers.arrayElement(['BRI', 'BCA', 'Permata', 'BNI']),
    //       userId: faker.number.int({ min: 1, max: 10 }),
    //       courseId: faker.number.int({ min: 1, max: 30 })
    //   }
  
    //   await db.order.create({ data: seedUserOrders })
    // }

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

