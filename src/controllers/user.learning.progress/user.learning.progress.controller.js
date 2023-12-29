const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')
   
module.exports = {

    getLearningProgress: async(req, res) => {
        try {

            const userCourseId = parseInt(req.params.userCourseId)
            const contentId = parseInt(req.params.contentId)
            
            if (!userCourseId) return res.status(422).json(utils.apiError("Params userCourseId tidak boleh kosong"))
            if (!contentId) return res.status(422).json(utils.apiError("Params contentId tidak boleh kosong"))

            const checkUserCourse = await db.userCourse.findFirst({
                where:{
                    id: userCourseId,
                    userId: res.user.id
                },
               
            })

            if(!checkUserCourse) return res.status(404).json(utils.apiError("User course tidak ditemukkan"))
            
            const userLearningProgress = await db.userLearningProgress.findFirst({
                where: {
                    contentId: contentId,
                    userCourseId: userCourseId
                }
            })

            if(!userLearningProgress) return res.status(404).json(utils.apiError("User course id atau content id tidak ada"))

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

            if (!userCourseId) return res.status(422).json(utils.apiError("user course id tidak boleh kosong"))

            const userCourse = await db.userCourse.findUnique({
                where: {
                    id: userCourseId,
                    userId: res.user.id
                }
            })

            if(!userCourse) return res.status(404).json(utils.apiError("user course id tidak ditemukan"))

            const userLearningProgress = await db.userLearningProgress.findFirst({
                where:{
                    contentId: contentId,
                    userCourseId: userCourseId,
                }
            })

            if(!userLearningProgress) return res.status(404).json(utils.apiError("User LEarning progress tidak ada"))

            /* console.log("============================== ", userLearningProgress) */

            if(userLearningProgress.isFinished) return res.status(500).json(utils.apiError("Konten sudah diselesaikan"))

           /*  const content = await db.courseContent.findFirst({
                where: {
                    id: contentId
                }
            })

            const currentSequence = content.sequence

            if(currentSequence !== 1) {
                const previousContent = await db.courseContent.findFirst({
                    where: {
                        sequence: currentSequence - 1
                    }
                })

                if (!previousContent) return res.status(404).json(utils.apiError("Konten sebelumnya tidak ditemukan"))
                
                const previousLearning = await db.userLearningProgress.findFirst({
                    where: {
                        userCourseId: userCourseId,
                        contentId: previousContent.id
                    }
                })

                if(previousLearning.isFinished === false) return res.status(403).json(utils.apiError("Content sebelumnya belum diselesaikan"))
            } */

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
