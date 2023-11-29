const db = require('../../prisma/connection'),
    utils = require('./utils'),
    emailHelper = require('../helpers/email'),
    transporter = require('./transporter')

module.exports = {
    sendOtp: async(email, confEmail) => {
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

            let mailOptions

            if (confEmail === 'register') {
                mailOptions = await emailHelper.register(email, otp)
            } else if(confEmail === 'request-reset-password') {
                mailOptions = await emailHelper.requestResetPassword(email, otp)
            } else if(confEmail === 'resend-otp') {
                mailOptions = await emailHelper.resendOtp(email, otp)
            }
            
            await transporter.sendEmail(mailOptions)

            const hashedOtp = await utils.createHashData(otp)
            const expiredAt = new Date(Date.now() + 600000)

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

                return utils.apiSuccess("Verifikasi otp berhasil")
            } else {
                return utils.apiError("Otp tidak valid atau tidak cocok")
            }
        } catch (error) {
            console.log(error)
        }
    }
}
