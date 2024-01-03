const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    imageKitFile = require('../../utils/imageKitFile')
   

module.exports = {
    register: async (req, res) => {
        try {

                if (!req.file) return res.status(403).json(utils.apiError("Foto tidak boleh kosong"))

                const photoInstructor = req.file
                const allowedMimes = [ "image/png","image/jpeg","image/jpg","image/webp" ]
                const allowedSizeMb = 2
    
                if(!allowedMimes.includes(photoInstructor.mimetype)) return res.status(409).json(utils.apiError("Format gambar tidak diperbolehkan"))
    
                if((photoInstructor.size / (1024*1024)) > allowedSizeMb) return res.status(409).json(utils.apiError("Gambar kategori tidak boleh lebih dari 2mb"))
    
                const uploadFile = await imageKitFile.upload(photoInstructor)
    
                if(!uploadFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

                const uploadFileUrl = uploadFile.url
                const uploadFileName = uploadFile.name


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
                    photoProfile: uploadFileUrl,
                    imageFilename: uploadFileName
                }
            })

            const data = {
                name: instructor.name,
                email: instructor.email,
                photoProfile: instructor.photoProfile
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

            const payload = { id: instructor.id, roleName: instructor.roleName }
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

    changePassword: async (req, res) => {

        try {
            
            const instructorId = res.user.id
            const {oldPassword, newPassword} = req.body

            const instructor = await db.courseInstructor.findUnique({
                where:{
                    id: instructorId
                }
            })


            if(!instructor) return res.status(404).json(utils.apiError("User tidak ditemukkan"))

            if(instructor.password) {
                const verifyOldPassword = await utils.verifyHashData(oldPassword, instructor.password)

                if(!verifyOldPassword) return res.status(409).json(utils.apiError("Password lama salah"))
            }

            const hashPassword = await utils.createHashData(newPassword)

            await db.courseInstructor.update({
                where:{
                    id: instructorId
                },
                data: {
                    password: hashPassword
                }
            })

            return res.status(200).json(utils.apiSuccess("Password berhasil diubah"))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },
    
}