const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    sendOtp = require('../../utils/send.otp')

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

            const emailSent = await sendOtp.send(email)

            if(emailSent) {
                const user = await db.user.create({
                    data: {
                        name: name,
                        email: email,
                        phone: BigInt(phone),
                        password: hashPassword,
                        photoProfile: {
                            create: {
                                urlPhoto: "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png"
                            }
                        }
                    }
                })

                // const data = exclude(user, ['password'])

                const data = {
                    name: user.name,
                    email: user.email,
                    phone: parseInt(user.phone),
                }

                return res.status(201).json(utils.apiSuccess("Pendaftaran akun berhasil. Periksa email masuk untuk kode verifikasi Otp", data))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError('Kesalahan pada internal server'))
        }
    },

    login: async (req, res) => {
        try {
            const user = await db.user.findUnique({
                where: {
                  email: req.body.email,
                },
              })

            if (!user) return res.status(400).json(utils.apiError("Email tidak terdaftar"))

            const verified = user.verified

            if (!verified) return res.status(409).json(utils.apiError("Akun belum terverifikasi"))

            const verifyPassword = await utils.verifyHashData(req.body.password, user.password)

            if (!verifyPassword) return res.status(409).json(utils.apiError("Password salah"))

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
                photoProfile: user.photoProfile.urlPhoto
            }
    
            return res.status(200).json(utils.apiSuccess("Data user berhasil diambil", data))
        } catch (error) {
            console.log(error);
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"));
        }
      }
}