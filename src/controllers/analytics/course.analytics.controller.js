const db = require('../../../prisma/connection'),
    filter = require('../../utils/filter'),
    utils = require('../../utils/utils')

module.exports = {

    getCourse: async (req, res) => {
        try {

            const { total, active} = req.query

            let whereCondition = {}
            whereCondition = await filter.analytic.filterWhereCondition(whereCondition, active)

            let courses = await db.course.findMany({
                where: whereCondition
            })

            if(total) {
                courses = await db.course.count()
            }

            courses = await db.course.count({ where: whereCondition })

            const message = await filter.analytic.message(total, active)

            return res.status(200).json(utils.apiSuccess(message, courses))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    getCoursePrecentage: async (req, res) => {
        try {

            const { f0t25, less50, less75, less95 } = req.query

            const coursesWithAverageProgress = await db.userCourse.groupBy({
                by: ['courseId'],
                _avg: {
                  progress: true
                }
            })

            let firstNumber
            let secondNumber

            if (f0t25) {
                firstNumber = 0
                secondNumber = 25
            }

            const filteredCourses = coursesWithAverageProgress.filter(course => {
            const avgProgress = course._avg.progress;

                if (f0t25) {
                    return avgProgress >= firstNumber && avgProgress <= secondNumber;
                } else {
                    return avgProgress >= 0 && avgProgress <= 100
                }
            })
                    
            const coursesData = await Promise.all(filteredCourses.map(async (course) => {
                const courseData = await db.course.findUnique({
                    where: {
                        id: course.courseId
                    },
                    select: {
                        id: true,
                        title: true
                    }
                })
                    return {
                        courseId: courseData.id,
                        courseTitle: courseData.title,
                        averageProgress: course._avg.progress
                    }
                }))

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data", coursesData))
             
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }

}