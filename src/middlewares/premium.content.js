const db = require('../../prisma/connection'),
    utils = require('../utils/utils')

const premiumContent = async (req, res, next) => {
    const userCourse = await db.userCourse.findFirst({
        where: {
            userId: res.user.id,
            courseId: parseInt(req.params.courseId)
        }
    })

    const content = await db.courseContent.findUnique({
        where: {
          id: parseInt(req.params.contentId)
        }
      })

    if(content) {
        if(content.isFree === true) {
            return next()
        } else if (content.isFree === false && userCourse) {
            return next()
        } else {
            return res.status(403).json(utils.apiError("Ini adalah content premium. Silahkan order course ini terlebih dahulu"))
        }
    } else {
        return res.status(404).json(utils.apiError("Content tidak ditemukan"))
    }
}

module.exports = { premiumContent }
