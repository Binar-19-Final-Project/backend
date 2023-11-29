const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {
    read: async(req, res) => {
        try {
            let { category, page = 1, limit = 10, search, popular, promo } = req.query
            let skip = ( page - 1 ) * limit

            let whereCondition = {}
            if (category) {
                whereCondition = {
                    courseCategory: {
                        slug: category
                    }
                }
            }

            if (search) {
                whereCondition.OR = [
                  { title: { contains: search } },
                ];
            }

            const getCoursePromo = promo && promo.toLowerCase() === 'true'

            if (promo) {
                whereCondition = {
                    isPromo: getCoursePromo
                }
            }

            const orderByPopular = popular && popular.toLowerCase() === 'true'

            const courses = await db.course.findMany({
                take: parseInt(limit),
                skip: skip,
                where: whereCondition,
                include: {
                    courseCategory: true,
                    courseLevel: true,
                    courseType: true,
                    coursePromo: true,
                    instructor: true
                },
                orderBy: orderByPopular ? { taken: 'desc' } : undefined
            })

            const resultCount = await db.course.count({ where: whereCondition }) 

            const totalPage = Math.ceil(resultCount / limit)

            // const data = courses.map((course) => ({
            //     id: course.id,
            //     title: course.title,
            //     slug: course.slug,
            //     description: course.description,
            //     price: course.price,
            //     rating: course.rating,
            //     duration: course.duration,
            //     taken: course.taken,
            //     imageUrl: course.imageUrl,
            //     category: course.courseCategory.name,
            //     type: course.courseType.name,
            //     level: course.courseLevel.name,
            //     instructor: course.instructor.name,
            //     namePromo: course.coursePromo.name,
            //     discount: course.coursePromo.discount,
            //     totalPrice: ,
            //     publishedAt: course.createdAt
            // }))

            const data = courses.map((course) => {
                const originalPrice = course.price;
                const promoName = course.coursePromo ? course.coursePromo.name : null;
                const discount = course.coursePromo ? course.coursePromo.discount : null;
              
                let totalPrice = originalPrice;
                if (discount) {
                  const discountAmount = (originalPrice * discount) / 100;
                  totalPrice = originalPrice - discountAmount;
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
                  namePromo: promoName,
                  discount: discount,
                  totalPrice: totalPrice,
                  publishedAt: course.createdAt
                };
              });
              

            let message = "Berhasil mengambil data course"
            
            if (search) {
                message += ` berdasarkan kata kunci '${search}'`
            } 

            if (category) {
                message += ` berdasarkan kategori '${category}'`
            }

            if (resultCount === 0) {
                message = "Course tidak ditemukan";
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