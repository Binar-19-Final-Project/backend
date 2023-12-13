const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')
   
module.exports = {

    getLearningProgress: async(req, res) => {
        try {

            const userCourseId = parseInt(req.params.userCourseId)
            const contentId = parseInt(req.params.contentId)    

            const checkUserCourse = await db.userCourse.findFirst({
                where:{
                    id: userCourseId,
                    userId: res.user.id
                }
            })

            if(!checkUserCourse) return res.status(404).json(utils.apiError("User course tidak ditemukkan"))
            
            const userLearningProgress = await db.userLearningProgress.findFirst({
                where: {
                    contentId: contentId,
                    userCourseId: userCourseId
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil mendapatkan learning progress", userLearningProgress))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    updateLearningProgress: async(req, res) => {
        try {

            const userCourseId = parseInt(req.params.userCourseId)
            const contentId = parseInt(req.params.contentId)

            const userCourse = await db.userCourse.findUnique({
                where: {
                    id: userCourseId,
                    userId: res.user.id
                }
            })

            const userLearningProgress = await db.userLearningProgress.findFirst({
                where:{
                    contentId: contentId,
                    userCourseId: userCourseId,
                }
            })

            if(userLearningProgress.isFinished) return res.status(500).json(utils.apiError("Konten sudah diselesaikan"))

            const course = await db.course.findUnique({
                where: {
                    id: userCourse.courseId
                },
                include: {
                    courseModule: {
                        include: {
                            _count: {
                                select: {
                                    courseContent: true
                                }
                            }
                        }
                    }
                }
            })

            let totalContent = 0
         
            course.courseModule.forEach(async (item, index, array) => {
                totalContent += item._count.courseContent
            })

            const data = await db.userLearningProgress.update({
                where: {
                    id: userLearningProgress.id
                },
                data: {
                    isFinished: true,
                    finishedAt: new Date()
                }
            })

            const totalFinished = await db.userLearningProgress.count({
                where:{
                    userCourseId: userCourse.id,
                    isFinished: true
                }
            })
            
            let progress = (totalFinished / totalContent) * 100

            let status = "In Progress"

            if(totalFinished == totalContent)
            {
               status = "Selesai"
            }

            await db.userCourse.update({
                where: {
                    id: userCourse.id
                },
                data : {
                    progress: progress,
                    status: status
                }
            })

            return res.status(200).json(utils.apiSuccess("Konten berhasil diselesaikan", data))        
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}
