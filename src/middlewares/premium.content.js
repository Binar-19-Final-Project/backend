const db = require('../../prisma/connection'),
    utils = require('../utils/utils')

const premiumContent = async (req, res, next) => {
    const userCourse = await db.userCourse.findFirst({
        where: {
            userId: res.user.id,
            courseId: parseInt(req.params.courseId)
        }
    })

    const content = await db.courseContent.findFirst({
        where: {
            id: parseInt(req.params.contentId), 
            moduleId: parseInt(req.params.moduleId), 
            courseModule: {
                    courseId: parseInt(req.params.courseId),
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

    const user = await db.user.findUnique({
        where: {
            id: res.user.id
        }
    })

    const role = await db.role.findUnique({
        where: {
            id: user.roleId
        }
    })


    if(content) {
        if(content.isDemo === true) {
            return next()
        } else if(content.isFree === true && userCourse || role.name === 'admin') {
            return next()
        } else if (content.isFree === false && userCourse || role.name === 'admin') {
            return next()
        } else {
            return res.status(403).json(utils.apiError("Ini adalah content premium. Silahkan order course ini terlebih dahulu"))
        }
    } else {
        return res.status(404).json(utils.apiError("Content tidak ditemukan"))
    }
}

module.exports = { premiumContent }
