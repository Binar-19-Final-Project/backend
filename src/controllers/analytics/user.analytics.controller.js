const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')
const { getCoursePrecentage } = require('./course.analytics.controller')

module.exports = {
    
    totalUser: async (req, res) => {
        try {
            const users = await db.user.count()

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data total user", users))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    userActive: async (req, res) => {
        try {

            const { threeDaysAgo, sevenDaysAgo,  oneMonthsAgo } = req.query

            let gte
            let message = 'Berhasil mengambil data total user aktif '

            if(threeDaysAgo) {
                gte = new Date(new Date() - 3 * 24 * 60 * 60 * 1000)
                message += `'tiga hari terakhir'`
            }

            if(sevenDaysAgo) {
                gte = new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                message += `'tujuh hari terakhir'`
            }

            if(oneMonthsAgo) {
                gte = new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
                message += `'satu bulan terakhir'`
            }


            const activeUsers = await db.userCourse.findMany({
                where: {
                    progress: {
                        gt: 1
                    },
                    updatedAt: {
                        gte: gte
                    },
                },
                distinct: ['userId'],
            })

              const userCount = activeUsers.length

              return res.status(200).json(utils.apiSuccess(message, userCount))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },
}