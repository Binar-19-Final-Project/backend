const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    userCourseUtils = require('../../utils/userCourse.utils'),
    courseFilters = require('../../utils/course.filter')

module.exports = {
    getUserCoursesById: async(req, res) => {
        try {
            const id = res.user.id
            const userId = parseInt(id)

            let { page = 1, limit = 10, search, category, level, learningStatus, promo, popular, latest } = req.query

            /* Pagination */
            let skip = ( page - 1 ) * limit

            let filter = {}

            filter = courseFilters.filterWhereCondition(userId, filter, category, level, learningStatus, promo, popular, latest)

            /* Order By */
            const orderBy = await userCourseUtils.orderBy(popular, latest)

            const userCourses = await db.userCourse.findMany({
                take: parseInt(limit),
                skip: skip,
                where: filter,
                include: {
                    userLearningProgress: true,
                    course:  {
                        include: {
                            courseCategory: true,
                            courseLevel: true,
                            courseInstructor: true,
                            courseModule: {
                                include: {
                                    courseContent: true
                                }
                            }
                        }
                    }
                },
                orderBy: orderBy
            })

            const data = userCourses.map((userCourse) => {
                const totalModule = userCourse.course.courseModule.length 

                let totalDuration = 0 

                userCourse.course.courseModule.forEach((module) => {
                    totalDuration += module.courseContent.reduce((total, content) => {
                        return total + content.duration
                    }, 0)
                })

                return {
                    id: userCourse.id,
                    progress: userCourse.progress,
                    status: userCourse.status,
                    userId: userCourse.userId,
                    orderAt: userCourse.createdAt,
                    courses: {
                        id: userCourse.course.id,
                        name: userCourse.course.title,
                        category: userCourse.course.courseCategory.name,
                        instructor: userCourse.course.courseInstructor.name,
                        level: userCourse.course.courseLevel.name,
                        rating: userCourse.course.rating,
                        promo: userCourse.course.isPromo,
                        totalModule: totalModule,
                        totalDuration: totalDuration
                    }
                }
            })


            /* Total Data & Total Page after Pagination */
            const resultCount = await db.userCourse.count({ where: filter }) 
            const totalPage = Math.ceil(resultCount / limit)

            if (resultCount === 0) {
                return res.status(404).json(utils.apiError("Data tidak ditemukan"))
            }

            const message = await userCourseUtils.messageResponse({ search, category, level, promo, popular, latest })

            return res.status(200).json(utils.apiSuccess(
                message,
                data, 
                {   
                    currentPage: parseInt(page),
                    totalPage: totalPage,
                    totalData: resultCount
                }
            ))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    }
}