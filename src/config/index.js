const dotEnv = require("dotenv");
dotEnv.config();

module.exports = {
  PORT: process.env.PORT,

  /* JWT Key Configuration*/
  JWT_SECRET_KEY: process.env.PORT,

  /* Nodemailer Configuration */
  NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT,
  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,

  RAILWAY_URL: process.env.RAILWAY_URL,
  LOCAL_URL: process.env.LOCAL_URL
};
