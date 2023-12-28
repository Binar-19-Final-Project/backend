const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    userLearningProgress = require('../../utils/user-learning-progress'),
    filter = require('../../utils/filter')

module.exports = {

    getOrders: async (req, res) => {
        try {


            let { page = 1, limit = 10, status } = req.query

            /* Pagination */
            let skip = ( page - 1 ) * limit

            /* Filter */
            /* let whereCondition = {} */

            const whereCondition = await filter.order.filterWhereCondition(status)

            const data = await db.order.findMany({
                take: parseInt(limit),
                skip: skip,
                where: whereCondition,
                orderBy: {
                    createdAt: 'desc'
                }
            })

            /* Total Data & Total Page after Pagination */
            const resultCount = await db.order.count() 
            const totalPage = Math.ceil(resultCount / limit)

            if (resultCount === 0) {
                return res.status(404).json(utils.apiError("Tidak ada data course"))
            }

            return res.status(200).json(utils.apiSuccess(
                "Berhasil mengambil data riwayat semua order",
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
    },

    getOrderHistoryById: async (req, res) => {
        try {
            const id  = res.user.id

            const historyOrders = await db.order.findMany({
                where: {
                    userId: parseInt(id)
                },
                include: {
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
                }
            })


            const data = historyOrders.map((orderHistory) => {
                const totalModule = orderHistory.course.courseModule.length 

                let totalDuration = 0 

                orderHistory.course.courseModule.forEach((module) => {
                    totalDuration += module.courseContent.reduce((total, content) => {
                        return total + content.duration
                    }, 0)
                })

                return {
                    id: orderHistory.id,
                    orderCode: orderHistory.orderCode,
                    price: orderHistory.price,
                    status: orderHistory.status,
                    paymentMethod: orderHistory.paymentMethod,
                    userId: orderHistory.userId,
                    courses: {
                        name: orderHistory.course.title,
                        category: orderHistory.course.courseCategory.name,
                        imageUrl: orderHistory.course.imageUrl,
                        instructor: orderHistory.course.courseInstructor.name,
                        level: orderHistory.course.courseLevel.name,
                        rating: orderHistory.course.rating,
                        totalModule: totalModule,
                        totalDuration: totalDuration
                    }
                }
            })
                
            if(!historyOrders) return res.status(404).json(utils.apiError("Riwayat order tidak ditemukan"))

            return res.status(200).json(utils.apiSuccess('Berhasil mengambil riwayat order berdasarkan id user', data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    },

    createOrder: async(req, res) => {
        try {
            const id = res.user.id
            const courseId = req.params.courseId

            const existUserCourse = await db.userCourse.findFirst({
                where: {
                    userId: id,
                    courseId: parseInt(courseId)
                }
            })

            const course = await db.course.findUnique({
                where: {
                    id: parseInt(courseId)
                },
                include: {
                    courseType: true
                }
            })

            if(!course) return res.status(404).json(utils.apiError("Course tidak ada"))

            if(!existUserCourse) {
                if(course.courseType.name === 'Free' || 'Premium') {
                    const orderFreeCourse = await db.userCourse.create({
                        data: {
                            userId: id,
                            courseId: parseInt(courseId),
                            progress: 0,
                            status: "In Progress"
                        }
                    })

                    const modules = await db.courseModule.findMany({
                        where: {
                            courseId: orderFreeCourse.courseId
                        },
                        select: {
                            id: true
                        }
                    })

                    const moduleIds = modules.map(({id}) => id)

                    const contents = await db.courseContent.findMany({
                        where: {
                            moduleId: {
                                in: moduleIds
                            }
                        },
                        select: {
                            id: true
                        }
                    })

                    contents.forEach( async (item, index, array) => {
                        await userLearningProgress.createUserLearningProgress(item.id, orderFreeCourse.id)
                    })

                    return res.status(201).json(utils.apiSuccess("Berhasil Mengambil Kelas Gratis", orderFreeCourse))
                
                } /* else if (course.courseType.name === 'Premium') {
                    return res.status(403).json(utils.apiError("Fitur Pembayaran Belum Tersedia"))
                } */

            } else {
                return res.status(409).json(utils.apiError("Course sudah tersedia"))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    }
}