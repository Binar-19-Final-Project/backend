const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {
    checkAccess: async (req, res) => {
        try {
            const id = res.user.id

            const { contentId, moduleId, courseId } = req.params

            const userCourse = await db.userCourse.findFirst({
                where: {
                    userId: parseInt(id),
                    courseId: parseInt(courseId)
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

            if(!userCourse) {
                return res.status(403).json(utils.apiError('Tidak mempunyai access ke content ini'))
            } else {
                return res.status(200).json(utils.apiSuccess('User dapat mengakses content ini'))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}