const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {
    getAll: async (req, res) => {
        try {
            
            const data = await db.courseModule.findMany()

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil semua data module", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    create: async (req, res) => {
        try {

            const {title, duration, totalChapter, courseId} = req.body

            const checkTitle = await db.courseModule.findFirst({
                where:{
                    title: title,
                    courseId: courseId
                }
            })

            if(checkTitle) return res.status(409).json(utils.apiError("Judul modul sudah terdaftar"))

            const checkCourse = await db.course.findUnique({
                where:{
                    id: courseId
                }
            })

            if(!checkCourse) return res.status(404).json(utils.apiError("Course tidak ditemukkan"))

            const titleSlug = await utils.createSlug(title)

            const data = await db.courseModule.create({
                data: {
                    title: title,
                    slug: titleSlug,
                    duration: duration,
                    totalChapter: totalChapter,
                    courseId: courseId
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil membuat modul", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    getById: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const data = await db.courseModule.findUnique({
                where:{
                    id: id
                }
            })

            if(!data) return res.status(404).json(utils.apiError("Modul tidak ditemukkan"))

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data modul berdasarkan id", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    update: async (req, res) => {
        try {

            const {title, duration, totalChapter, courseId} = req.body
            const id = parseInt(req.params.id)

            const checkModule = await db.courseModule.findUnique({
                where:{
                    id: id
                }
            })

            if(!checkModule) return res.status(404).json(utils.apiError("Modul tidak ditemukkan"))

            const checkCourse = await db.course.findUnique({
                where:{
                    id: courseId
                }
            })

            if(!checkCourse) return res.status(404).json(utils.apiError("Course tidak ditemukkan"))

            const checkTitle = await db.courseModule.findFirst({
                where: {
                    title: title,
                    courseId: courseId,
                    NOT: {
                        id: id
                    }
                }
            })

            if(checkTitle) return res.status(409).json(utils.apiError("Judul modul sudah terdaftar"))

            const titleSlug = await utils.createSlug(title);

            const data = await db.courseModule.update({
                where:{
                    id: id
                },

                data: {
                    title: title,
                    slug: titleSlug,
                    duration: duration,
                    totalChapter: totalChapter
                }
            })

            return res.status(200).json(utils.apiSuccess("Modul berhasil diubah", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    delete: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const check = await db.courseModule.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.apiError("Modul tidak ditemukkan"))

            await db.courseModule.delete({
                where: {
                    id: id
                }
            })

            return res.status(200).json(utils.apiSuccess("Modul berhasil dihapus"))            

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

}
