const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {
    checkUserCourse: async (req, res) => {
        try {
            const id = res.user.id

            const courseId = req.params.courseId

            const checkCourse = await db.userCourse.findFirst({
                where: {
                    userId: id,
                    courseId: parseInt(courseId)
                }   
            })

            if(checkCourse) {
                return res.status(200).json(utils.apiSuccess('User sudah mengambil course ini'))
            } else {
                return res.status(404).json(utils.apiError('User belum memiliki course ini'))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    },

    checkAccess: async (req, res) => {
        try {
            const id = res.user.id

            const { contentId, moduleId, courseId } = req.params

            const userCourse = await db.userCourse.findFirst({
                where: {
                    user: {
                        id: id
                    },
                    course: {
                        id: parseInt(courseId)
                    }
                },
                include: {
                    course: {
                        include: {
                            courseModule: {
                                where: {
                                    id: parseInt(moduleId)
                                }, include: {
                                    courseContent: {
                                        where: {
                                            id: parseInt(contentId)
                                        }
                                    }
                                }
                                
                            }
                        }
                    }
                }
            })
            
            if(userCourse) {
                return res.status(200).json(utils.apiSuccess('User dapat mengakses content ini'))
            } else {
                const content = await db.courseContent.findFirst({
                    where: {
                        id: parseInt(contentId)
                    }
                })

                if (content.isDemo === true) {
                    return res.status(200).json(utils.apiSuccess('User dapat mengakses content ini'))
                } else {
                    return res.status(403).json(utils.apiError('Tidak mempunyai access ke content ini. Silahkan order / enroll course terlebih dahulu'))
                }
            }

            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}