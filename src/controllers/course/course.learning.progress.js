const db = require('../../../prisma/connection'),
    userLearningProgress = require('../../utils/user-learning-progress')
   
module.exports = {

    getProgressByUserCourseId: async (req, res) => {
        try {

            const {userCourseId} = req.params

            const userCourse = await db.userCourse.findUnique({
                where:{
                    id: userCourseId
                }
            })


            
        } catch (error) {
            
        }
    },

    createLearningProgress: async (req, res) => {
        try {
            
            const userCourseId = 1;

            const checkUserCourse = await db.userCourse.findUnique({
                where: {
                    id: userCourseId
                }
            })

            const modules = await db.courseModule.findMany({
                where: {
                    courseId: checkUserCourse.courseId
                },
                select: {
                    id: true
                }
            })

            const contents = await db.courseContent.findMany({
                where: {
                    id: {
                        in: modules.id
                    }
                },
                select: {
                    id: true
                }
            })

            contents.forEach( async (item, index, array) => {
                const test = await userLearningProgress.createUserLearningProgress(item.id, userCourseId)
                if(!test) console.log('error')
            })

        

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    updateLearningProgress: async(req, res) => {
        try {

            const {contentId, userCourseId} = req.body

            const userCourse = await db.userCourse.findUnique({
                where: {
                    id: userCourseId
                }
            })

            if(!userCourse) return res.status(404).json(utils.apiError("User course tidak ditemukkan"))

            const content = await db.courseContent.findUnique({
                where: {
                    id: contentId
                },
                include: {
                    courseModule: {
                        include: {
                            course: true
                        }
                    }
                }
            })

            const totalContent = await db.course.findUnique({
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

            console.log(totalContent)

            // await db.userLearningProgress.update({
            //     where: {
            //         userCourseId: userCourse.id,
            //         contentId: contentId
            //     },
            //     data: {
            //         isFinished: true,
            //         finishedAt: new Date()
            //     }
            // })

            // await db.userCourse.update({
            //     where: {
            //         userId: res.user.id,
            //         courseId: content.courseModule.course.id
            //     },
            //     data : {
            //         progress
            //     }
            // })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}
