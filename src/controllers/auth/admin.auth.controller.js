const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body

            const checkEmail = await db.admin.findUnique({
                where: {
                    email: email
                }
            })

            if(checkEmail) return res.status(409).json(utils.apiError("Email telah terdaftar"))

            const hashPassword = await utils.createHashData(password)

            const admin = await db.admin.create({
                data: {
                    name: name,
                    email: email,
                    password: hashPassword,
                    roleName: "admin",
                }
            })

            const data = {
                name: admin.name,
                email: admin.email,
            }

            return res.status(201).json(utils.apiSuccess("Akun berhasil dibuat", data))
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError('Kesalahan pada internal server'))
        }
    },

    login: async (req, res) => {
        try {

            const { email, password } = req.body
            const admin = await db.admin.findUnique({
                where: {
                  email: email,
                },
              })

            if (!admin) return res.status(400).json(utils.apiError("Email tidak terdaftar"))

            const verifyPassword = await utils.verifyHashData(password, admin.password)

            if (!verifyPassword) return res.status(409).json(utils.apiError("Password salah"))

            if(!admin.roleName === 'admin') return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))

            const payload = { id: admin.id, roleName: admin.roleName }
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
}