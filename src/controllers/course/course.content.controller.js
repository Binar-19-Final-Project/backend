const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {
    getAll: async (req, res) => {
        try {
            
            const data = await db.courseContent.findMany()

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil semua data konten", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    getById: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const data = await db.courseContent.findUnique({
                where:{
                    id: id
                }
            })

            if(!data) return res.status(404).json(utils.apiError("Konten tidak ditemukkan"))

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data konten berdasarkan id", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    getCourseContentByIdModuleAndCourse: async (req, res) => {
        const { contentId, moduleId, courseId } = req.params
        try {
            const courseContent = await db.courseContent.findFirst({
                where: {
                    id: parseInt(contentId), 
                    moduleId: parseInt(moduleId), 
                    courseModule: {
                            courseId: parseInt(courseId),
                        },
                },
                include: {
                    courseModule: true,
                    courseModule: {
                        include: {
                            course: true
                        }
                    }
                }
            })

            if (!courseContent) {
                return res.status(404).json(utils.apiError("Content tidak ditemukan"))
            }

            const data = {
                id: courseContent.id,
                title: courseContent.title,
                slug: courseContent.slug,
                sequence: courseContent.sequence,
                videoUrl: courseContent.videoUrl,
                duration: courseContent.duration,
                isFree: courseContent.isFree,
                moduleId: courseContent.moduleId,
                courseId: courseContent.courseModule.courseId
            }

            return res.status(200).json(utils.apiSuccess("Behasil mengambil data content", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    create: async (req, res) => {
        try {

            const {title, videoUrl, duration, isFree, moduleId} = req.body

            const checkTitle = await db.courseContent.findFirst({
                where:{
                    title: title,
                    moduleId: moduleId
                }
            })

            if(checkTitle) return res.status(409).json(utils.apiError("Judul konten sudah terdaftar"))

            const checkModule = await db.courseModule.findUnique({
                where:{
                    id: moduleId
                }
            })

            if(!checkModule) return res.status(404).json(utils.apiError("Modul tidak ditemukkan"))

            const titleSlug = await utils.createSlug(title)

            const data = await db.courseContent.create({
                data: {
                    title: title,
                    slug: titleSlug,
                    duration: duration,
                    videoUrl: videoUrl,
                    isFree: isFree,
                    moduleId: moduleId
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil membuat konten", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },


    update: async (req, res) => {
        try {

            const {title, videoUrl, duration, isFree, moduleId} = req.body
            const id = parseInt(req.params.id)

            const checkContent = await db.courseContent.findUnique({
                where:{
                    id: id
                }
            })

            if(!checkContent) return res.status(404).json(utils.apiError("Konten tidak ditemukkan"))

            const checkModule = await db.courseModule.findUnique({
                where:{
                    id: moduleId
                }
            })

            if(!checkModule) return res.status(404).json(utils.apiError("Modul tidak ditemukkan"))

            const checkTitle = await db.courseContent.findFirst({
                where: {
                    title: title,
                    moduleId: moduleId,
                    NOT: {
                        id: id
                    }
                }
            })

            if(checkTitle) return res.status(409).json(utils.apiError("Judul konten sudah terdaftar"))

            const titleSlug = await utils.createSlug(title)

            const data = await db.courseContent.update({
                where:{
                    id: id
                },

                data: {
                    title: title,
                    slug: titleSlug,
                    duration: duration,
                    videoUrl: videoUrl,
                    isFree: isFree,
                    moduleId: moduleId
                }
            })

            return res.status(200).json(utils.apiSuccess("Konten berhasil diubah", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    delete: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const check = await db.courseContent.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.apiError("Konten tidak ditemukkan"))

            await db.courseContent.delete({
                where: {
                    id: id
                }
            })

            return res.status(200).json(utils.apiSuccess("Konten berhasil dihapus"))            

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

}
