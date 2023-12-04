const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {

    getOrderHistoryById: async (req, res) => {
        try {
            const id  = res.user.id

            const ordersHistory = await db.order.findMany({
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


            const data = ordersHistory.map((orderHistory) => {
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
                        instructor: orderHistory.course.courseInstructor.name,
                        level: orderHistory.course.courseLevel.name,
                        rating: orderHistory.course.rating,
                        totalModule: totalModule,
                        totalDuration: totalDuration
                    }
                }
            })
                
    
            if(!ordersHistory) return res.status(404).json(utils.apiError("Riwayat order tidak ditemukan"))

            return res.status(200).json(utils.apiSuccess('Berhasil mengambil riwayat order berdasarkan id', data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    }
}