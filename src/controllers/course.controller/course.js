const db = require('../../../prisma/connection'),
    courseUtils = require('../../utils/course.utils'),
    utils = require('../../utils/utils')

module.exports = {
    read: async(req, res) => {
        try {
            let { page = 1, limit = 10, search, category, level, type, popular, popularByCategory, promo, latest } = req.query

            /* Pagination */
            let skip = ( page - 1 ) * limit

            /* Filter */
            let filter = {}

            filter = await courseUtils.filterSearch(filter, search)
            filter = await courseUtils.filterCategory(filter, category)
            filter = await courseUtils.filterLevel(filter, level)
            filter = await courseUtils.filterPromo(filter, promo)

            /* Order By */
            let orderBy = []

            orderBy = await courseUtils.orderByLatest(orderBy, latest)
            orderBy = await courseUtils.orderByPopular(orderBy, popular)

            const courses = await db.course.findMany({
                take: parseInt(limit),
                skip: skip,
                where: filter,
                include: {
                    courseCategory: true,
                    courseLevel: true,
                    courseType: true,
                    coursePromo: true,
                    instructor: true,
                    courseModule: true
                },
               orderBy: orderBy
            })

            const data = courses.map((course) => {
                const originalPrice = course.price
                const promoName = course.coursePromo ? course.coursePromo.name : null
                const discount = course.coursePromo ? course.coursePromo.discount : null
                const totalModule = course.courseModule.length
              
                let totalPrice = originalPrice
                if (discount) {
                  const discountAmount = (originalPrice * discount) / 100
                  totalPrice = originalPrice - discountAmount
                }
              
                return {
                  id: course.id,
                  title: course.title,
                  slug: course.slug,
                  description: course.description,
                  originalPrice: originalPrice,
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

        //     if (popularByCategory) {
        //     const popularCourses = await db.course.findMany({
        //         where: filter,
        //         include: {
        //             courseCategory: true,
        //             courseLevel: true,
        //             courseType: true,
        //             coursePromo: true,
        //             instructor: true,
        //             courseModule: true
        //         },
        //         orderBy: {
        //             taken: 'desc'
        //         }
        //     })
        
        //     const groupedByCategory = {}
        //     popularCourses.forEach(course => {
        //         const category = course.courseCategory.name
        //         if (!groupedByCategory[category]) {
        //             groupedByCategory[category] = []
        //         }

        //         const originalPrice = course.price
        //         const promoName = course.coursePromo ? course.coursePromo.name : null
        //         const discount = course.coursePromo ? course.coursePromo.discount : null
        //         const totalModule = course.courseModule.length

        //         groupedByCategory[category].push({
        //             id: course.id,
        //             title: course.title,
        //             slug: course.slug,
        //             description: course.description,
        //              originalPrice: originalPrice,
        //             rating: course.rating,
        //             duration: course.duration,
        //             taken: course.taken,
        //             imageUrl: course.imageUrl,
        //             category: course.courseCategory.name,
        //             type: course.courseType.name,
        //             level: course.courseLevel.name,
        //             instructor: course.instructor.name,
        //             totalModule: totalModule,
        //             namePromo: promoName,
        //             discount: discount,
        //             publishedAt: course.createdAt
        //         })
        //     })

        //     let message = "Berhasil mengambil data course popular"
        
        //     if (popular) {
        //         message += ` popular berdasarkan kategori`
        //     }

        //     if (category) {
        //         message += ` berdasarkan kategori '${category}'`
        //     }
        
        //     return res.status(200).json(utils.apiSuccess(message, groupedByCategory ))
        // }

            /* Total Data & Total Page after Pagination */
            const resultCount = await db.course.count({ where: filter }) 
            const totalPage = Math.ceil(resultCount / limit)

            if (resultCount === 0) {
                return res.status(404).json(utils.apiError("Tidak ada data course"))
            }

            const message = await courseUtils.messageResponse({ search, category, level, type, promo, popular, latest })

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
    },

    readById: async (req, res) => {
        try {
            const { id } = req.params

            const course = await db.course.findUnique({
                where: {
                    id: parseInt(id)
                },
                include: {
                    courseCategory: true,
                    courseLevel: true,
                    courseType: true,
                    coursePromo: true,
                    instructor: true,
                    courseModule: {
                        include: {
                            courseContent: true
                        }
                    }
                }
            })

            if (!course) {
                return res.status(404).json(utils.apiError("Tidak ada data course"))
            }

            const originalPrice = course.price
            const promoName = course.coursePromo ? course.coursePromo.name : null
            const discount = course.coursePromo ? course.coursePromo.discount : null
            const totalModule = course.courseModule.length

            let totalPrice = originalPrice
            if (discount) {
                const discountAmount = (originalPrice * discount) / 100
                totalPrice = originalPrice - discountAmount
            }
            
            const data = {
                id: course.id,
                title: course.title,
                slug: course.slug,
                description: course.description,
                originalPrice: originalPrice,
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
                publishedAt: course.createdAt,
                updatedAt: course.updatedAt,
                modules: course.courseModule.map((module) => {
                    const totalDuration = module.courseContent.reduce((total, content) => {
                        return total + content.duration
                    }, 0)

                    const totalContent = module.courseContent.length

                    return {
                        id: module.id,
                        title: module.title,
                        slug: module.slug,
                        duration: totalDuration, 
                        totalContent: totalContent,
                        contents: module.courseContent.map((content) => ({
                            title: content.title,
                            slug: content.slug,
                            urlVideo: content.videoUrl,
                            duration: content.duration,
                        }))
                    }
                })
            }

            return res.status(200).json(utils.apiSuccess("Data course berdasarkan id berhasil diambil", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}

// read: async(req, res) => {
//     try {
//         let { page = 1, limit = 10, search, category, level, type, popularByCategory, promo, latest } = req.query

//         /* Pagination */
//         let skip = ( page - 1 ) * limit

//         /* Where Condition */
//filter = {}

//         if (search) {
//             whereCondition.OR = [
//               { title: { contains: search } },
//             ]
//         }

//         if (category) {
//             const categories = Array.isArray(category) ? category : [category]
//             whereCondition = {
//                 courseCategory: {
//                     slug: {
//                         in: categories
//                     }
//                 }
//             }
//         }

//         if (type) {
//             whereCondition = {
//                 courseType: {
//                     name: type
//                 }
//             }
//         }

//         if (level) {
//             const levels = Array.isArray(level) ? level : [level]
//             whereCondition = {
//                 courseLevel: {
//                     slug: {
//                         in: levels
//                     }
//                 }
//             }
//         }
        

//         if (promo) {
//             whereCondition = {
//                 isPromo: true
//             }
//         }

//         /* Order by Condition */
//         let orderByCondition = []

//         if(latest) {
//             orderByCondition = [
//                 {
//                     createdAt: 'desc'
//                 }
//             ]
//         }

//         if (popularByCategory) {
//             const popularCourses = await db.course.findMany({
//                 where: whereCondition,
//                 include: {
//                     courseCategory: true,
//                     courseLevel: true,
//                     courseType: true,
//                     coursePromo: true,
//                     instructor: true,
//                     courseModule: true
//                 },
//                 orderBy: {
//                     taken: 'desc'
//                 }
//             })
        
//             const groupedByCategory = {}
//             popularCourses.forEach(course => {
//                 const category = course.courseCategory.name
//                 if (!groupedByCategory[category]) {
//                     groupedByCategory[category] = []
//                 }

//                 const originalPrice = course.price
//                 const promoName = course.coursePromo ? course.coursePromo.name : null
//                 const discount = course.coursePromo ? course.coursePromo.discount : null
//                 const totalModule = course.courseModule.length

//                 groupedByCategory[category].push({
//                     id: course.id,
//                     title: course.title,
//                     slug: course.slug,
//                     description: course.description,
//                      originalPrice: originalPrice,
//                     rating: course.rating,
//                     duration: course.duration,
//                     taken: course.taken,
//                     imageUrl: course.imageUrl,
//                     category: course.courseCategory.name,
//                     type: course.courseType.name,
//                     level: course.courseLevel.name,
//                     instructor: course.instructor.name,
//                     totalModule: totalModule,
//                     namePromo: promoName,
//                     discount: discount,
//                     publishedAt: course.createdAt
//                 })
//             })

//             let message = "Berhasil mengambil data course"
        
//             if (popularB) {
//                 message += ` popular berdasarkan kategori`
//             }

//             if (category) {
//                 message += ` berdasarkan kategori '${category}'`
//             }
        
//             return res.status(200).json(utils.apiSuccess(message, groupedByCategory ))
//         }
        
//         const courses = await db.course.findMany({
//             take: parseInt(limit),
//             skip: skip,
//             where: whereCondition,
//             include: {
//                 courseCategory: true,
//                 courseLevel: true,
//                 courseType: true,
//                 coursePromo: true,
//                 instructor: true,
//                 courseModule: true
//             },
//            orderBy: orderByCondition
//         })

//         const resultCount = await db.course.count({ where: whereCondition }) 

//         const totalPage = Math.ceil(resultCount / limit)

//         const data = courses.map((course) => {
//             const originalPrice = course.price
//             const promoName = course.coursePromo ? course.coursePromo.name : null
//             const discount = course.coursePromo ? course.coursePromo.discount : null
//             const totalModule = course.courseModule.length
          
//             let totalPrice = originalPrice
//             if (discount) {
//               const discountAmount = (originalPrice * discount) / 100
//               totalPrice = originalPrice - discountAmount
//             }
          
//             return {
//               id: course.id,
//               title: course.title,
//               slug: course.slug,
//               description: course.description,
//               originalPrice: originalPrice,
//               rating: course.rating,
//               duration: course.duration,
//               taken: course.taken,
//               imageUrl: course.imageUrl,
//               category: course.courseCategory.name,
//               type: course.courseType.name,
//               level: course.courseLevel.name,
//               instructor: course.instructor.name,
//               totalModule: totalModule,
//               namePromo: promoName,
//               discount: discount,
//               totalPrice: totalPrice,
//               publishedAt: course.createdAt
//             }
//           })
          

//         let message = "Berhasil mengambil data course"
        
//         if (search) {
//             message += ` berdasarkan kata kunci '${search}'`
//         } 

//         if (category) {
//             message += ` berdasarkan kategori '${category}'`
//         }

//         if (level) {
//             message += ` berdasarkan level '${level}'`
//         }

//         if (promo) {
//             message += ` berdasarkan promo`
//         }

//         if (popular) {
//             message += ` berdasarkan popular`
//         }

//         if (latest) {
//             message += ` berdasarkan terbaru`
//         }

//         if (resultCount === 0) {
//             return res.status(404).json(utils.apiError("Tidak ada data course"))
//         }

//         return res.status(200).json(utils.apiSuccess(
//             message,
//             data, 
//             {   
//                 currentPage: parseInt(page),
//                 totalPage: totalPage,
//                 totalData: resultCount
//             }
//         ))

//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
//     }
// },