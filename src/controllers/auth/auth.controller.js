const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    notification = require('../../utils/notification'),
    otpUtils = require('../../utils/otp'),
    resetUtils = require('../../utils/reset-password'),
    imageKitFile = require('../../utils/imageKitFile'),
    axios = require('axios')
    /* { google } = require("googleapis"),
    { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } = require('../../config') */

/* const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL
)

const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
] */

/* const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
}) */

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
                        roleName: "user",
                        photoProfile: "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png",
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

            if (!verified) {
                const emailSent = await otpUtils.sendOtp(email, 'register')
                if (emailSent) {
                    return res.status(409).json(utils.apiError("Akun belum terverifikasi. Periksa email masuk untuk verifikasi kode Otp", { email }))
                } else {
                    return res.status(500).json(utils.apiError('Kesalahan pada internal server'))
                }
            }

            if(!user.roleName === 'user') return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))

            const payload = { id: user.id, roleName: user.roleName }
            const token = await utils.createJwt(payload)

            const data = {
                token: token
            }

            return res.status(200).json(utils.apiSuccess("Login berhasil", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError('Kesalahan pada internal server'))
        }
    },

    loginAdmin: async (req, res) => {
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

            if(!user.roleName === 'admin') return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))

            const payload = { id: user.id }
            const token = await utils.createJwt(payload)

            const data = {
                token: token
            }

            return res.status(200).json(utils.apiSuccess("Login berhasil", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError('Kesalahan pada internal server'))
        }
    },

    /* googleLogin: (req, res) => {
        res.redirect(authorizationUrl)
    }, */

    googleLogin: async (req, res) => {
        try {
          const { accessToken } = req.body
    
          const response = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
          );
          
          const { sub, email, name } = response.data
      
          /* let user = await User.findOne({ where: { googleId: sub } }); */

            let user = await db.user.findFirst({
                where: {
                    googleId: sub
                }
            })

            if(!user) {
                user = await db.user.create({
                    data: {
                        email: email,
                        name: name,
                        googleId: sub,
                        roleName: "user",
                        photoProfile: "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png",
                    }
                })
            }

          /* if (!user)
            user = await User.create({
              email,
              name,
              googleId: sub,
              registeredVia: "google",
              roleId,
            }); */
      
            const payload = { id: user.id, roleName: user.roleName }
            const token = await utils.createJwt(payload)
            const data = {
                token: token
            }
      
            return res.status(200).json(utils.apiSuccess("Login berhasil", data))
        } catch (error) {
          console.error(error);
      
          let status = 500;
          if (axios.isAxiosError(error)) {
            error.message = error.response.data.error_description;
            status = error.response.status;
          }
      
          return res.status(status).json(utils.apiError(error.message));
        }
      },

    /* googleCallbackLogin: async (req, res) => {
        const { code } = req.query
        const { tokens } = await oauth2Client.getToken(code)

        oauth2Client.setCredentials(tokens)

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: "v2",
        })

        const { data } = await oauth2.userinfo.get()

        if (!data.email || !data.name)
            return res.json({
                data: data,
        })

        let user = await db.user.findUnique({
            where: {
                email: data.email,
            },
        })

        if (!user) {
            user = await db.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    verified: true,
                    photoProfile: data.picture
                },
            })
        }
 
        const payload = { id: user.id }
        const token = await utils.createJwt(payload)
        const responseData = {
            token: token
        }

        // return res.redirect(`http://localhost:3000/auth-success?token=${token}`)

        return res.status(200).json(utils.apiSuccess("Login berhasil", responseData))
    }, */


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

            let bcryptResetToken = await utils.createHashData(email)

            let resetToken = bcryptResetToken.replace(/[\/\\.]/g, "a")

            await db.user.update({
                data:{
                    resetToken: resetToken
                },
                where:{
                    id: user.id
                }
            })

            const resetPasswordSent = await resetUtils.send(email, resetToken)

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

            const sendNotification = await notification.createNotification("Reset Password", null, "Reset password berhasil", user.id)

            if(!sendNotification) console.log('Gagal mengirim notifikasi')

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
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    getProfile: async (req, res) => {
        try {
            // const { id } = res.user.id
            const user = await db.user.findUnique({
                where: {
                    id: res.user.id
                }
            })

            if(!user) return res.status(404).json(utils.apiError("User tidak ditemukkan"))
        
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
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    changePassword: async (req, res) => {

        try {
            
            const userId = res.user.id
            const {oldPassword, newPassword} = req.body

            const user = await db.user.findUnique({
                where:{
                    id: userId
                }
            })


            if(!user) return res.status(404).json(utils.apiError("User tidak ditemukkan"))

            if(user.password) {
                const verifyOldPassword = await utils.verifyHashData(oldPassword, user.password)

                if(!verifyOldPassword) return res.status(409).json(utils.apiError("Password lama salah"))
            }

            const hashPassword = await utils.createHashData(newPassword)

            await db.user.update({
                where:{
                    id: userId
                },
                data: {
                    password: hashPassword
                }
            })

            const sendNotification = await notification.createNotification("Update Password", null, "Ubah password berhasil" ,userId)

            if(!sendNotification) console.log('Gagal mengirim notifikasi')

            return res.status(200).json(utils.apiSuccess("Password berhasil diubah"))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    changePasswordGoogle: async (req, res) => {

        try {
            
            const userId = res.user.id
            const {oldPassword, newPassword} = req.body

            const user = await db.user.findUnique({
                where:{
                    id: userId
                }
            })

            if(!user) return res.status(404).json(utils.apiError("User tidak ditemukkan"))

            const verifyOldPassword = await utils.verifyHashData(oldPassword, user.password)

            if(!verifyOldPassword) return res.status(409).json(utils.apiError("Password lama salah"))

            const hashPassword = await utils.createHashData(newPassword)

            await db.user.update({
                where:{
                    id: userId
                },
                data: {
                    password: hashPassword
                }
            })

            const sendNotification = await notification.createNotification("Update Password", null, "Ubah password berhasil" ,userId)

            if(!sendNotification) console.log('Gagal mengirim notifikasi')

            return res.status(200).json(utils.apiSuccess("Password berhasil diubah"))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },


    updateProfile: async (req, res) => {
        try {

            const {name, phone, city, country} = req.body

            await db.user.update({
                where: {
                    id: res.user.id
                },
                data: {
                    name: name,
                    phone: phone,
                    country: country,
                    city: city
                }
            })

            const sendNotification = await notification.createNotification("Update Profile", null, "Profile berhasil diperbarui", res.user.id)

            if(!sendNotification) console.log('Gagal mengirim notifikasi')

            return res.status(200).json(utils.apiSuccess("Profile berhasil diperbarui"))
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    updateProfilePhoto: async (req, res) => {
        try {

            const photoProfile = req.file

            const allowedSizeMb = 2
            const allowedMimes = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/webp'
            ]

            if(typeof photoProfile === 'undefined') return res.status(400).json(utils.apiError("Gambar tidak boleh kosong"))

            if(!allowedMimes.includes(photoProfile.mimetype)) return res.status(400).json(utils.apiError("Harus bertipe gambar (.png, .jpeg, .jpg, .webp)"))

            if((photoProfile.size / (1024*1024)) > allowedSizeMb) return res.status(400).json(utils.apiError("Gambar tidak boleh lebih dari 2mb"))

            // const user = await db.user.findUnique({
            //     where: {
            //         id: res.user.id
            //     }
            // })
            // if(user.imageFilename !== null) {
            //     const deleteFile = await imageKitFile.delete(user.imageFilename)
            //     if(!deleteFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
            // }

            const uploadFile = await imageKitFile.upload(photoProfile)

            if(!uploadFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

            await db.user.update({
                where: {
                    id: res.user.id
                },
                data: {
                    photoProfile: uploadFile.url,
                    imageFilename: uploadFile.name
                }
            })

            const sendNotification = await notification.createNotification("Update Profile Photo", null, "Foto profile berhasil diubah", res.user.id)

            if(!sendNotification) console.log('Gagal mengirim notifikasi')

            return res.status(200).json(utils.apiSuccess("Foto profile berhasil diperbarui"))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}