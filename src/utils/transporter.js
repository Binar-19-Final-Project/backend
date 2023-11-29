const nodemailer = require("nodemailer"),
  utils = require('./utils')

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
}

const transporter = nodemailer.createTransport(config)

module.exports = {
  create: () => nodemailer.createTransport(config),
  

  sendEmail: async (mailOptions) => {
    try {
      const send = await transporter.sendMail(mailOptions)
      return send.response
    } catch (error) {
      console.log(error)
      throw new Error(`${error.message}`)
    }
  },
}
