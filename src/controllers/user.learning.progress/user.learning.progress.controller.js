const db = require('../../../prisma/connection'),
    userLearningProgress = require('../../utils/user-learning-progress'),
    utils = require('../../utils/utils')
   
module.exports = {

    // createLearningProgress: async (req, res) => {
    //     try {
            
    //         const userCourseId = 2;

    //         const checkUserCourse = await db.userCourse.findUnique({
    //             where: {
    //                 id: userCourseId
    //             }
    //         })

    //         const modules = await db.courseModule.findMany({
    //             where: {
    //                 courseId: checkUserCourse.courseId
    //             },
    //             select: {
    //                 id: true
    //             }
    //         })

    //         const contents = await db.courseContent.findMany({
    //             where: {
    //                 id: {
    //                     in: modules.id
    //                 }
    //             },
    //             select: {
    //                 id: true
    //             }
    //         })

    //         contents.forEach( async (item, index, array) => {
    //             const test = await userLearningProgress.createUserLearningProgress(item.id, userCourseId)
    //             if(!test) console.log('error')
    //         })

    //         return res.status(200).json(utils.apiSuccess("Berhasil"))        

    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
    //     }
    // },

    updateLearningProgress: async(req, res) => {
        try {

            const {contentId, userCourseId} = req.body

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

            await db.userLearningProgress.update({
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

            await db.userCourse.update({
                where: {
                    id: userCourse.id
                },
                data : {
                    progress: progress
                }
            })

            return res.status(200).json(utils.apiSuccess("Konten berhasil diselesaikan"))        
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}
