const db = require('../../../prisma/connection'),
    responseApi = require('../../utils/response.api'),
    hashData = require('../../utils/hash.data'),
    sendOtp = require('../../utils/send.otp'),
    { exclude } = require('../../utils/exclude.data')

module.exports = {
    register: async (req, res) => {
        try {
            const { name, email, phone, password } = req.body

            const checkEmail = await db.user.findUnique({
                where: {
                    email: email
                }
            })

            if(checkEmail) return res.status(409).json(responseApi.error("Email telah terdaftar"))

            const hashPassword = await hashData.create(password)

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

                return res.status(201).json(responseApi.success("Pendaftaran akun berhasil. Periksa email masuk untuk kode verifikasi Otp", data))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error('Kesalahan pada internal server'))
        }
    },
}