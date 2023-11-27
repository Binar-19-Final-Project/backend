const nodemailer = require("nodemailer")

const {NODEMAILER_SERVICE, NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_EMAIL, NODEMAILER_PASS } = require('../config')

const config = {
  service: NODEMAILER_SERVICE,
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  secure: false,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASS,
  },
};

module.exports = {
  create: () => nodemailer.createTransport(config),

  send: async (mailOptions) => {
    try {
      const transporter = nodemailer.createTransport(config);
      const send = await transporter.sendMail(mailOptions);
      return send.response;
    } catch (error) {
      console.log(err);
      throw new Error(`${error.message}`);
    }
  },
};
