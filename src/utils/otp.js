const db = require('../../prisma/connection'),
    utils = require('./utils')
    transporter = require('./transporter'),
    { NODEMAILER_EMAIL } = require('../config')

module.exports = {
    sendOtp: async(email) => {
        try {

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

            await transporter.sendEmail(mailOptions)

            const hashedOtp = await utils.createHashData(otp)
            const expiredAt = new Date(Date.now() + 60000)

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
    },

    verifyOtp: async(email, otp) => {
        try {
            const existOtp = await db.otp.findFirst({
                where: {
                    email: email
                }
            })

            const expiredAt = existOtp.expiredAt

            // if (expiredAt < Date.now()) {
            //     await db.otp.delete({
            //         where: {
            //             id: existOtp.id
            //         }
            //     })

            //     return utils.apiError("Otp telah kadaluwarsa")
            // }

            const hashedOtp = existOtp.otp
            const verifyOtp = await utils.verifyHashData(otp, hashedOtp)

            if (verifyOtp) {
                if (expiredAt < Date.now()) {
                    await db.otp.delete({
                        where: {
                            id: existOtp.id
                        }
                    })
    
                    return utils.apiError("Otp telah kadaluwarsa")
                }
                    await db.otp.delete({
                        where: {
                            id: existOtp.id
                        }
                    })

                return utils.apiError("Verifikasi otp berhasil")
            } else {
                return utils.apiError("Otp tidak valid atau tidak cocok")
            }
        } catch (error) {
            console.log(error)
        }
    }
}
