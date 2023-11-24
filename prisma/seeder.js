const db = require('./connection')
const { faker } = require('@faker-js/faker/locale/id_ID')
const bcrypt = require("bcrypt")

const usedRoleName = new Set()

async function seedData()  {
    /* Reset database before run seeder */
    await db.$transaction([db.user.deleteMany()]);
    await db.$transaction([db.role.deleteMany()]);
    await db.$queryRaw`ALTER TABLE users AUTO_INCREMENT = 1`;
    await db.$queryRaw`ALTER TABLE roles AUTO_INCREMENT = 1`;

    /* Role Seeder */
    for (let i = 0; i < 2; i++) {
        let roleName;
        do {
          roleName = faker.helpers.arrayElement(['user', 'admin']);
        } while (usedRoleName.has(roleName));
    
        usedRoleName.add(roleName);
    
        const seedRole = {
          name: roleName,
        }
    
        await db.role.create({ data: seedRole });
    }

    /* User Seeder */
    for (let i = 0; i < 10; i++) {
        const seedUser = {
            uuid: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.number.int({ max: 100000000 }),
            password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10)), 
            verified: faker.datatype.boolean(0.9),
            roleId: faker.number.int({ min: 1, max: 3 }), 
        };
    
        await db.user.create({ data: seedUser });
    }

    /* Disconnect Prisma Connection */
    await db.$disconnect();
}


/* Run Seeder Function */
seedData()
  .then(() => {
    console.log("============= Seeder Finished =================")
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

