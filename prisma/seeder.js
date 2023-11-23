const db = require('./connection')
const { faker } = require('@faker-js/faker/locale/id_ID')
const bcrypt = require("bcrypt");

async function seedData()  {

    /* User Seeder */
    for (let i = 0; i < 10; i++) {
        const seedUser = {
            uuid: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10)), 
            verified: faker.datatype.boolean(0.9),
            roleId: faker.number.int({ min: 1, max: 3 }), 
        };
    
        await db.user.create({ data: seedUser });
    }

    /* Prisma Disconnect Connection */
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

