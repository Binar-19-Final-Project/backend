const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    notification = require('../../utils/notification')

module.exports = {

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
                    userLearningProgress: {
                        include: {
                            userCourse: true
                        }
                    },
                    courseModule: {
                        include: {
                            course: true
                        }
                    }
                }
            })

            if (!courseContent) {
                return res.status(404).json(utils.apiError("Konten tidak ditemukkan"))
            }

            const userId = res.user.id

            const userCourses = await db.userCourse.findFirst({
                where: {
                    userId: userId,
                    courseId: parseInt(courseId)
                }
            })

            let data = {
                contentId: courseContent.id,
                title: courseContent.title,
                slug: courseContent.slug,
                sequence: courseContent.sequence,
                videoUrl: courseContent.videoUrl,
                duration: courseContent.duration,
                isDemo: courseContent.isDemo,
                moduleId: courseContent.moduleId,
                courseId: courseContent.courseModule.courseId,
            };
            
            if (userCourses) {
                data.userCourseId = userCourses.id;
            }
            
            return res.status(200).json(utils.apiSuccess("Behasil mengambil data konten", data));
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    createCourseContent: async (req, res) => {
        try {

            const {title, videoUrl, duration, isDemo, moduleId} = req.body

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

            const courseContent = await db.courseContent.findMany({
                where: {
                    moduleId: moduleId
                }
            })

            const sequence = courseContent.length + 1

            const titleSlug = await utils.createSlug(title)

            const data = await db.courseContent.create({
                data: {
                    title: title,
                    slug: titleSlug,
                    sequence: sequence,
                    duration: duration,
                    videoUrl: videoUrl,
                    isDemo: isDemo,
                    moduleId: moduleId
                }
            })

            const userCourses = await db.userCourse.findMany({
                where: {
                    courseId: checkModule.courseId
                },
                include: {
                    course: true
                }
            })

            userCourses.forEach( async (item, index, array) => {
                const sendNotification = await notification.createNotification('New Content', item, 'Kelas yang kamu ikuti terdapat konten baru', item.userId)
                if(!sendNotification) console.log("Gagal mengirim notifikasi")
            })
            
            return res.status(200).json(utils.apiSuccess("Berhasil membuat konten", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    updateCourseContent: async (req, res) => {
        try {

            const {title, sequence, videoUrl, duration, isDemo, moduleId} = req.body
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

            const prevContent = await db.courseContent.findFirst({
                where:{
                    sequence: sequence,
                    moduleId: moduleId,
                },
                select: {
                    id: true
                }
            })

            await db.courseContent.update({
                where:{
                    id: prevContent.id
                },
                data:{
                    sequence: checkContent.sequence
                }
            })

            const data = await db.courseContent.update({
                where:{
                    id: id
                },

                data: {
                    title: title,
                    slug: titleSlug,
                    sequence: sequence,
                    duration: duration,
                    videoUrl: videoUrl,
                    isDemo: isDemo,
                    moduleId: moduleId
                }
            })

            return res.status(200).json(utils.apiSuccess("Konten berhasil diubah", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    deleteCourseContent: async (req, res) => {
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
