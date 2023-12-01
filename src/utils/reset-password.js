const db = require('../../prisma/connection'),
    utils = require('./utils'),
    emailHelper = require('../helpers/email'),
    transporter = require('./transporter')

module.exports = {
    send: async(email, resetToken) => {
        try {

            const mailOptions = await emailHelper.requestResetPassword(email, resetToken)

            await transporter.sendEmail(mailOptions)

            return true
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}