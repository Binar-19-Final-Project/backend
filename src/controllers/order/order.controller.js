const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    userLearningProgress = require('../../utils/user-learning-progress'),
    notification = require('../../utils/notification'),
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

            const orders = await db.order.findMany({
                take: parseInt(limit),
                skip: skip,
                where: whereCondition,
                orderBy: {
                    createdAt: 'desc'
                }, include: {
                    course: true,
                    user: true
                }
            })

            const data = orders.map((order) => ({
                orderId: order.id,
                orderCode: order.orderCode,
                price: order.price,
                orderStatus: order.status,
                paymentMethod: order.paymentMethod,
                successAt: order.successAt,
                orderAt: order.createdAt,
                username: order.user.name,
                courseName: order.course.title
            }))

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

    enrollFree: async(req, res) => {
        try {
            const userId = res.user.id
            const courseId = parseInt(req.params.courseId)

            const existUserCourse = await db.userCourse.findFirst({
                where: {
                    userId: userId,
                    courseId: courseId
                }
            })

            const course = await db.course.findUnique({
                where: {
                    id: courseId
                },
                include: {
                    courseType: true
                }
            })

            if(!course) return res.status(404).json(utils.apiError("Course tidak ada"))

            const type = course.courseType.name

            if(type !== 'Free') return res.status(403).json(utils.apiError("Ini adalah untuk proses ambil course gratis"))

            if(!existUserCourse) {

                    const orderFreeCourse = await db.userCourse.create({
                        data: {
                            userId: userId,
                            courseId: courseId,
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

                    await db.course.update({
                        where:{
                            id: courseId
                        },
                        data: {
                            taken: {
                                increment: 1
                            }
                        }
                    })

                    return res.status(201).json(utils.apiSuccess("Berhasil Mengambil Kelas", orderFreeCourse))
                
                /*  else if (course.courseType.name === 'Premium') {

                    // if(!paymentMethod) return res.status(422).json(utils.apiError("paymentMethod tidak boleh kosong"))

                    const randomCode = Math.floor(100000 + Math.random() * 900000)

                    const orderCode = `trx-${randomCode}`

                    const order = await db.order.create({
                        data: {
                            orderCode: orderCode,
                            price: course.price,
                            paymentMethod: paymentMethod,
                            status: 'Pending',
                            userId: userId,
                            courseId: course.id
                        }
                    })

                    await notification.createNotification("Proses Pembayaran", null, "Silahkan lakukan proses pembayaran untuk course yang telah diorder", userId)

                    return res.status(201).json(utils.apiError("Lakukan proses pembayaran untuk menyelesaikan pembelian course ini", order))
                } */

            } else {
                return res.status(409).json(utils.apiError("Course sudah tersedia"))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    },

    orderPremium: async (req, res) => {
        const userId = res.user.id
            const courseId = parseInt(req.params.courseId)
            const { paymentMethod }= req.body
            if(!paymentMethod) return res.status(422).json(utils.apiError("paymentMethod tidak boleh kosong"))

            const existUserCourse = await db.userCourse.findFirst({
                where: {
                    userId: userId,
                    courseId: courseId
                }
            })

            const course = await db.course.findUnique({
                where: {
                    id: courseId
                },
                include: {
                    courseType: true
                }
            })

            const checkOrder = await db.order.findFirst({
                where: {
                    userId: res.user.id,
                    courseId: courseId
                }
            })

            if(checkOrder) return res.status(409).json(utils.apiError("Anda sudah melakukan order. Selesaikan proses pembayaran"))

            const type = course.courseType.name

            if(type !== 'Premium') return res.status(403).json(utils.apiError("Ini adalah untuk proses ambil course premium"))

            if(!course) return res.status(404).json(utils.apiError("Course tidak ada"))

            if(!existUserCourse) {

                const randomCode = Math.floor(100000 + Math.random() * 900000)

                    const orderCode = `trx-${randomCode}`

                    const order = await db.order.create({
                        data: {
                            orderCode: orderCode,
                            price: course.price,
                            paymentMethod: paymentMethod,
                            status: 'Pending',
                            userId: userId,
                            courseId: course.id
                        }
                    })

                    await notification.createNotification("Proses Pembayaran", null, "Silahkan lakukan proses pembayaran untuk course yang telah diorder", userId)

                    return res.status(201).json(utils.apiError("Lakukan proses pembayaran untuk menyelesaikan pembelian course ini", order))
            } else {
                return res.status(409).json(utils.apiError("Course sudah tersedia"))
            }
    },

    confirmOrderPremium: async (req, res) => {
        try {
            const { id } = req.params

            const confimrOrder = await db.order.update({
                where: {
                    id: parseInt(id)
                }, data: {
                    status: 'Success',
                    successAt: new Date()
                }
            })

            if(confimrOrder) {

                const courseId = confimrOrder.courseId

                const userId = confimrOrder.userId

                const orderFreeCourse = await db.userCourse.create({
                    data: {
                        userId: userId,
                        courseId: courseId,
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

                await db.course.update({
                    where:{
                        id: courseId
                    },
                    data: {
                        taken: {
                            increment: 1
                        }
                    }
                })

                await notification.createNotification("Pembayaran Berhasil", null, "Pembayaran kelas premium berhasil dilakukan. Anda bisa mengakses kelas ini sekarang juga!", userId)

                return res.status(201).json(utils.apiSuccess("Konfirmasi pembelian berhasil", orderFreeCourse))

            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    }
}