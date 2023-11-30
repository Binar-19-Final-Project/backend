const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {
    read: async(req, res) => {
        try {
            let { page = 1, limit = 10, search, category, level, type, popular, promo, latest } = req.query

            /* Pagination */
            let skip = ( page - 1 ) * limit

            /* Where Condition */
            let whereCondition = {}

            if (search) {
                whereCondition.OR = [
                  { title: { contains: search } },
                ];
            }

            if (category) {
                const categories = Array.isArray(category) ? category : [category]
                whereCondition = {
                    courseCategory: {
                        slug: {
                            in: categories
                        }
                    }
                };
            }

            if (type) {
                whereCondition = {
                    courseType: {
                        name: type
                    }
                }
            }

            if (level) {
                const levels = Array.isArray(level) ? level : [level]
                whereCondition = {
                    courseLevel: {
                        slug: {
                            in: levels
                        }
                    }
                };
            }
            

            if (promo) {
                whereCondition = {
                    isPromo: true
                }
            }

            /* Order by Condition */
            let orderByCondition = []

            if(latest) {
                orderByCondition = [
                    {
                        createdAt: 'desc'
                    }
                ]
            }

            if(popular) {
                orderByCondition = [
                    {
                        taken: 'desc'
                    }
                ]
            }
            
            const courses = await db.course.findMany({
                take: parseInt(limit),
                skip: skip,
                where: whereCondition,
                include: {
                    courseModule: true,
                    courseCategory: true,
                    courseLevel: true,
                    courseType: true,
                    coursePromo: true,
                    instructor: true
                },
               orderBy: orderByCondition
            })

            const resultCount = await db.course.count({ where: whereCondition }) 

            const totalPage = Math.ceil(resultCount / limit)

            const data = courses.map((course) => {
                const originalPrice = course.price;
                const promoName = course.coursePromo ? course.coursePromo.name : null
                const discount = course.coursePromo ? course.coursePromo.discount : null
                const totalModule = course.courseModule.length
              
                let totalPrice = originalPrice;
                if (discount) {
                  const discountAmount = (originalPrice * discount) / 100;
                  totalPrice = originalPrice - discountAmount
                }
              
                return {
                  id: course.id,
                  title: course.title,
                  slug: course.slug,
                  description: course.description,
                  price: originalPrice,
                  rating: course.rating,
                  duration: course.duration,
                  taken: course.taken,
                  imageUrl: course.imageUrl,
                  category: course.courseCategory.name,
                  type: course.courseType.name,
                  level: course.courseLevel.name,
                  instructor: course.instructor.name,
                  totalModule: totalModule,
                  namePromo: promoName,
                  discount: discount,
                  totalPrice: totalPrice,
                  publishedAt: course.createdAt
                }
              })
              

            let message = "Berhasil mengambil data course"
            
            if (search) {
                message += ` berdasarkan kata kunci '${search}'`
            } 

            if (category) {
                message += ` berdasarkan kategori '${category}'`
            }

            if (level) {
                message += ` berdasarkan level '${level}'`
            }

            if (promo) {
                message += ` berdasarkan promo`
            }

            if (popular) {
                message += ` berdasarkan popular`
            }

            if (latest) {
                message += ` berdasarkan terbaru`
            }

            if (resultCount === 0) {
                return res.status(404).json(utils.apiError("Tidak ada data course"))
            }

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
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}