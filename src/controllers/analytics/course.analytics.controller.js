const db = require('../../../prisma/connection'),
    filter = require('../../utils/filter'),
    utils = require('../../utils/utils')

module.exports = {

    getCourse: async (req, res) => {
        try {

            const { active } = req.query

            let courses
            let message = "Berhasil mengambil data course"

            if(active) {
                courses = await db.course.findMany({
                    where: {
                        isPublished: true
                    }
                })
            } else {
                courses = await db.course.findMany()
            }

            const total = courses.length

            if (active) {
                message += ` berdasarkan status active`
            } else {
                message += ` berdasarkan total`
            }

            return res.status(200).json(utils.apiSuccess(message, total))

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
    },

    totalEnroll: async (req, res) => {
        try {

            const { free, premium } = req.query

            const userCourse  = await db.userCourse.findMany()

            const orders = await db.order.findMany()

            let totals
            let message
            if(free) {
                totals = userCourse.length - orders.length
                message = `Berhasil mengambil total enroll course 'free'`
            } else if(premium) {
                totals = orders.length
                message = `Berhasil mengambil total enroll course 'premium'`
            } else {
                totals = userCourse.length
                message = 'Berhasil mengambil total enroll course'
            }
    
            return res.status(200).json(utils.apiSuccess(message, totals))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    courseTaken: async (req, res) => {
        try {
            
            const { free, premium } = req.query
              
              const whereCondition = {};
              
              const orderByCondition = {
                id: 'asc' 
              };
              
              if (free === 'true') {
                whereCondition.courseType = {
                  name: 'Free'
                }
              } else if (premium === 'true') {
                whereCondition.courseType = {
                  name: 'Premium'
                }
              }
              
              const orderByTaken = {
                taken: 'desc'
              };
              
              const highestTaken = await db.course.findFirst({
                where: whereCondition,
                orderBy: orderByTaken,
                select: {
                  taken: true
                }
              });
              
              const courses = await db.course.findMany({
                where: {
                  courseType: whereCondition.courseType,
                  taken: highestTaken.taken
                },
                orderBy: orderByCondition
              });

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data", courses))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    totalCourseInCategory: async (req, res) => {
        try {
            const categories = await db.courseCategory.findMany({
                include: {
                    course: true
                }
            })

            const data = categories.map((category) => {

                const totalCourse = category.course.length

                return {
                    categoryName: category.name,
                    totalCourse: totalCourse,
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    totalInstructor: async (req, res) => {
        try {
            const instructors = await db.courseInstructor.findMany()

            const data = instructors.length

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    totalCourseByInstructor: async (req, res) => {
        try {
            const instructors = await db.courseInstructor.findMany({
                include: {
                    course: true
                }
            })

            const data = instructors.map((instructor) => ({
                instructorName: instructor.name,
                totalCourses: instructor.course.length
              }))

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    totalCourseByType: async (req, res) => {
        try {
            const types = await db.courseType.findMany({
                include: {
                    course: true
                }
            })

            const data = types.map((type) => ({
                typeName: type.name,
                totalCourse: type.course.length
            }))

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }

}