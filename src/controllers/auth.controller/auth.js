const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    otpUtils = require('../../utils/otp'),
    resetUtils = require('../../utils/reset-password')

module.exports = {
    register: async (req, res) => {
        try {
            const { name, email, phone, password } = req.body

            const checkEmail = await db.user.findUnique({
                where: {
                    email: email
                }
            })

            if(checkEmail) return res.status(409).json(utils.apiError("Email telah terdaftar"))

            const hashPassword = await utils.createHashData(password)

            const emailSent = await otpUtils.sendOtp(email, 'register')

            if (emailSent) {
                const user = await db.user.create({
                    data: {
                        name: name,
                        email: email,
                        phone: BigInt(phone),
                        password: hashPassword,
                        photoProfile: "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png"
                    }
                })

                // const data = exclude(user, ['password'])

                const data = {
                    name: user.name,
                    email: user.email,
                    phone: parseInt(user.phone),
                }

                return res.status(201).json(utils.apiSuccess("Pendaftaran akun berhasil. Periksa email masuk untuk kode verifikasi Otp", data))
            } else {
                return res.status(500).json(utils.apiError('Kesalahan pada internal server'))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError('Kesalahan pada internal server'))
        }
    },

    login: async (req, res) => {
        try {

            const { email, password } = req.body

            const user = await db.user.findUnique({
                where: {
                  email: email,
                },
              })

            if (!user) return res.status(400).json(utils.apiError("Email tidak terdaftar"))

            const verifyPassword = await utils.verifyHashData(password, user.password)

            if (!verifyPassword) return res.status(409).json(utils.apiError("Password salah"))

            const verified = user.verified

            if (!verified) return res.status(409).json(utils.apiError("Akun belum terverifikasi", { email }))

            const payload = { id: user.id }
            const token = utils.createJwt(payload)

            const data = {
                token: token
            }

            return res.status(200).json(utils.apiSuccess("Login berhasil", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError('Kesalahan pada internal server'))
        }
    },

    verifyUser: async (req, res) => {
        try {
            const {email, otp} = req.body

            const checkOtp = await db.otp.findFirst({
                where: {
                    email: email
                }
            })

            if(!checkOtp) return res.status(404).json(utils.apiError('Otp tidak ditemukan. Silahkan kirim ulang kembali'))

            const verifyOtp = await otpUtils.verifyOtp(email, otp)

            if (verifyOtp.status === 'success') {
                 await db.user.update({
                    where: {
                         email: email
                     }, data: {
                           verified: true
                    }
                })
                return res.status(200).json(utils.apiSuccess("User berhasil diverifikasi")) 
            } else {
                return res.status(409).json(utils.apiError(verifyOtp.message)) 
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError('Kesalahan pada internal server'))
        }
    },

    // requestResetPassword: async(req, res) => {
    //     try {
    //         const { email } = req.body

    //         const checkEmail = await db.user.findUnique({
    //             where: {
    //                 email: email
    //             }
    //         })

    //         if(checkEmail) {
    //             await otpUtils.sendOtp(email, 'request-reset-password')
    //             return res.status(200).json(utils.apiSuccess("Periksa email masuk untuk kode verifikasi Otp"))
    //         } else {
    //             return res.status(404).json(utils.apiError("Email tidak terdaftar"))
    //         }

    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
    //     }
             
    // },

    // resetPassword: async (req, res) => {
    //    try {
    //         const { email, otp, password } = req.body

    //         const checkOtp = await db.otp.findFirst({
    //             where: {
    //                 email: email
    //             }
    //         })

    //         if(!checkOtp) {
    //             return res.status(404).json(utils.apiError('Otp tidak ditemukan. Silahkan kirim ulang kembali'))
    //         }
            
    //         const hashPassword = await utils.createHashData(password) 
    //         const verifyOtp = await otpUtils.verifyOtp(email, otp)

    //         if (verifyOtp.status === 'success') {
    //             await db.user.update({
    //                 where: {
    //                     email: email
    //                 }, data: {
    //                     password: hashPassword
    //                 }
    //             })
    //             return res.status(200).json(utils.apiSuccess("Reset password berhasil"))  
    //         } else {
    //             return res.status(409).json(utils.apiError(verifyOtp.message))
    //         }

    //    } catch (error) {
    //         console.log(error);
    //         return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
    //    }
        
    // },

    requestResetPassword: async (req, res) => {
        try {
            
            const {email} = req.body

            const user = await db.user.findFirst({
                where: {
                    email: email
                }
            })

            if(!user) return res.status(404).json(utils.apiError("Email tidak ditemukkan"))

            if(user.resetToken != null) return res.status(500).json(utils.apiError("Link untuk reset password sudah dikirim ke email anda"))

            const bcryptResetToken = await utils.createHashData(email)

            bcryptResetToken.replace(/\//g, "-")

            await db.user.update({
                data:{
                    resetToken: bcryptResetToken
                },
                where:{
                    id: user.id
                }
            })

            const resetPasswordSent = await resetUtils.send(email, bcryptResetToken)

            if(!resetPasswordSent) return res.status(500).json(utils.apiError('Kesalahan pada internal server'))

            return res.status(200).json(utils.apiSuccess("Periksa email anda untuk link reset password"))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    resetPassword: async (req, res) => {
        try {

            const {resetToken, password} = req.body

            const user = await db.user.findFirst({
                where: {
                    resetToken: resetToken
                }
            })

            if(!user) return res.status(500).json(utils.apiError("Reset password token invalid"))

            const hashPassword = await utils.createHashData(password)

            await db.user.update({
                data: {
                    password: hashPassword,
                    resetToken: null
                },
                where:{
                    id: user.id
                }
            })

            return res.status(200).json(utils.apiSuccess("Reset password berhasil"))
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    resendOtp: async (req, res) => {
        try {
            const { email } = req.body

            const emailSent = await otpUtils.sendOtp(email, 'resend-otp')

            if(emailSent) {
                return res.status(200).json(utils.apiSuccess("Otp berhasil dikirim ulang. Periksa email masuk"))
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    profile: async (req, res) => {
        try {
            const { id } = res.user
            const user = await db.user.findUnique({
                where: {
                    id: id
                },
                include: {
                    photoProfile: true
                }
            })
        
            const data = {
                name: user.name,
                email: user.email,
                phone: parseInt(user.phone),
                city: user.city,
                country: user.country,
                photoProfile: user.photoProfile
            }
    
            return res.status(200).json(utils.apiSuccess("Data user berhasil diambil", data))
        } catch (error) {
            console.log(error);
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
      }
}