const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    notification = require('../../utils/notification')

module.exports = {

    getAllCourseModuleByCourseId: async (req, res) => {

        const { courseId } = req.params
        if (!courseId) return res.status(422).json(utils.apiError("Params courseId tidak boleh kosong"))

        try {

            const checkCourse = await db.course.findUnique({
                where: {
                    id: parseInt(courseId)
                }
            })

            if(!checkCourse) return res.status(404).json(utils.apiError("Course tidak ditemukkan"))

            const modules = await db.courseModule.findMany({
                where: { 
                    courseId: parseInt(courseId), 
                },
                include: {
                    courseContent: {
                        orderBy: {
                            sequence: 'asc'
                          }
                    }
                }
            })

            /* const data = modules.map((module) => ({
                id: module.id,
                title: module.title,
                slug: module.slug,
                totalContent: module.totalChapter,
                courseId: module.courseId,
                contents: module.courseContent.map((content) => ({
                    id: content.id,
                    sequence: content.sequence,
                    title: content.title,
                    slug: content.slug,
                    duration: content.duration,
                    videoUrl: content.videoUrl,
                    isFree: content.isFree
                }))
            })) */

            const data = modules.map((module) => {
                const totalContent = module.courseContent.length

                return {
                    moduleId: module.id,
                    title: module.title,
                    slug: module.slug,
                    totalContent: module.totalChapter,
                    courseId: module.courseId,
                    totalContent: totalContent,
                    contents: module.courseContent.map((content) => ({
                        contentId: content.id,
                        sequence: content.sequence,
                        title: content.title,
                        slug: content.slug,
                        duration: content.duration,
                        videoUrl: content.videoUrl,
                        isDemo: content.isDemo
                    }))
                }
            })

            if (!modules) {
                if(!data) return res.status(404).json(utils.apiError("Modul tidak ditemukkan"))
            }

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data modul berdasarkan id course", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    getCourseModuleByIdAndCourseId: async (req, res) => {

        const { courseId, moduleId } = req.params
        
        try {

            const checkCourse = await db.course.findUnique({
                where: {
                    id: parseInt(courseId)
                }
            })

            if(!checkCourse) return res.status(404).json(utils.apiError("Course tidak ditemukkan"))

            const module = await db.courseModule.findUnique({
                where: {
                    id: parseInt(moduleId),
                    courseId: parseInt(courseId)
                },
                include: {
                    courseContent: {
                        orderBy: {
                            sequence: 'asc'
                        }
                    }
                }
            })

            if(!module) return res.status(404).json(utils.apiError("Modul tidak ditemukkan"))

            const totalContent = module.courseContent.length

            const data = {
                moduleId: module.id,
                sequence: module.sequence,
                id: module.id,
                title: module.title,
                slug: module.slug,
                totalContent: totalContent,
                courseId: module.courseId,
                contents: module.courseContent.map((content) => ({
                    contentId: content.id,
                    sequence: content.sequence,
                    title: content.title,
                    slug: content.slug,
                    duration: content.duration,
                    videoUrl: content.videoUrl,
                    isFree: content.isFree
                }))
            }

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data modul berdasarkan id dan course id", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },
    
    createCourseModule: async (req, res) => {
        try {

            const {title, courseId} = req.body

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
                    courseId: courseId
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil membuat modul", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    updateCourseModule: async (req, res) => {
        try {

            const {title, courseId} = req.body
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
                }
            })

            return res.status(200).json(utils.apiSuccess("Modul berhasil diubah", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    deleteCourseModule: async (req, res) => {
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

    unpublishCourse: async(req, res) => {
        try {

            const moduleId = parseInt(req.params.moduleId)

            const publish = req.body.publish

            const checkCourse = await db.courseModule.findUnique({
                where:{
                    id: moduleId
                }
            })

            if(!checkCourse) return res.status(404).json(utils.apiError("Course Module tidak ditemukkan"))
            
            if(publish === 'true') {
                const course = await db.courseModule.update({
                    where: {
                        id: moduleId
                    },
                    data: {
                        isPublished: true
                    }
                })

                return res.status(201).json(utils.apiSuccess("Berhasil publish course module", course))
            }

            if(publish === 'false') {
                const course = await db.courseModule.update({
                    where: {
                        id: moduleId
                    },
                    data: {
                        isPublished: false
                    }
                })

                return res.status(201).json(utils.apiSuccess("Berhasil unpublish course module", course))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }

}
