const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    multer = require('multer')(),
    imageKitFile = require('../../utils/imageKitFile')

module.exports = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body

            const checkEmail = await db.courseInstructor.findUnique({
                where: {
                    email: email
                }
            })

            if(checkEmail) return res.status(409).json(utils.apiError("Email telah terdaftar"))

            const hashPassword = await utils.createHashData(password)

            const instructor = await db.courseInstructor.create({
                data: {
                    name: name,
                    email: email,
                    password: hashPassword,
                    roleName: 'instructor',
                    photoProfile: 'https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png'
                }
            })

            const data = {
                name: instructor.name,
                email: instructor.email,
            }

            return res.status(201).json(utils.apiSuccess("Instructor berhasil dibuat", data))
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError('Kesalahan pada internal server'))
        }
    },

    login: async (req, res) => {
        try {

            const { email, password } = req.body

            const instructor = await db.courseInstructor.findUnique({
                where: {
                  email: email,
                },
            })

            if (!instructor) return res.status(400).json(utils.apiError("Email tidak terdaftar"))

            const verifyPassword = await utils.verifyHashData(password, instructor.password)

            if (!verifyPassword) return res.status(409).json(utils.apiError("Password salah"))

            if(!instructor.roleName === 'instructor') return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))

            const payload = { id: instructor.id }
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