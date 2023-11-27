const db = require('../../prisma/connection'),
    utils = require('./utils')
    transporter = require('./transporter'),
    { NODEMAILER_EMAIL } = require('../config')

module.exports = {
    send: async(email) => {
        try {
            const createTransporter = transporter.create()
            await createTransporter.verify()

            const existOtp = await db.otp.findFirst({
                where: {
                    email: email
                }
            })

            if(existOtp) {
                await db.otp.delete({
                    where: {
                        id: existOtp.id
                    }
                })
            }

            const otp = await utils.generateOtp()

            const mailOptions = {
                from: NODEMAILER_EMAIL,
                to: email,
                subject: "Verifikasi OTP",
                html: `<p>Verifikasi OTP</p>
                    <p style="color: tomato; font-size:25px; letter-spacing: 2px;"><b>${otp}</b></p>
                    <p>This code <b>expires in 1 hour(s)</b>.</p>`,
            }

            await transporter.send(mailOptions)

            const hashedOtp = await utils.createHashData(otp)
            const expiredAt = new Date(Date.now() + 3600000)

            await db.otp.create({
                data: {
                    email: email,
                    otp: hashedOtp,
                    expiredAt: expiredAt
                }
            })
        
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}
