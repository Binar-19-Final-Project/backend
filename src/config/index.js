const dotEnv = require("dotenv")
dotEnv.config();

module.exports = {
  PORT: process.env.PORT,

  /* JWT Key Configuration*/
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

  /* Google Cloud Service */
  KEY_FILENAME: process.env.KEY_FILENAME,
  PROJECT_ID: process.env.PROJECT_ID,

  /* Nodemailer Configuration */
  NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT,
  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,

  /* Url Configuration */
  RAILWAY_URL: process.env.RAILWAY_URL,
  LOCAL_URL: process.env.LOCAL_URL,

  /* ImageKit Configuration */
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_SECRET_KEY: process.env.IMAGEKIT_SECRET_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,

  /* Google OAuth2 Configuration */
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL
};
