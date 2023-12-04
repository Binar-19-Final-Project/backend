const db = require('../../../prisma/connection'),
    courseUtils = require('../../utils/course.utils'),
    utils = require('../../utils/utils')

module.exports = {
    getCourses: async(req, res) => {
        try {
            let { page = 1, limit = 10, search, category, level, type, popular, promo, latest } = req.query

            /* Pagination */
            let skip = ( page - 1 ) * limit

            /* Filter */
            let filter = {}

            filter = await courseUtils.filterSearch(filter, search)
            filter = await courseUtils.filterCategory(filter, category)
            filter = await courseUtils.filterLevel(filter, level)
            filter = await courseUtils.filterPromo(filter, promo)

            /* Order By */
            const orderBy = await courseUtils.orderBy(popular, latest)

            // orderBy = await courseUtils.orderByLatest(latest)
            // orderBy = await courseUtils.orderByPopular(popular)

            const courses = await db.course.findMany({
                take: parseInt(limit),
                skip: skip,
                where: filter,
                include: {
                    courseCategory: true,
                    courseLevel: true,
                    courseType: true,
                    coursePromo: true,
                    courseInstructor: true,
                    courseModule: {
                        include: {
                            courseContent: {
                                orderBy: {
                                    sequence: 'asc'
                                  }
                            }
                        }
                    }
                },
               orderBy: orderBy
            })

            const data = courses.map((course) => {
                const originalPrice = course.price
                const promoName = course.coursePromo ? course.coursePromo.name : null
                const discount = course.coursePromo ? course.coursePromo.discount : null
                const totalModule = course.courseModule.length

                totalDurationModule = 0
                course.courseModule.map((module) => {
                    module.courseContent.map((content) => {
                        totalDurationModule += content.duration
                    })
                })

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
                  duration: totalDurationModule,
                  taken: course.taken,
                  imageUrl: course.imageUrl,
                  category: course.courseCategory.name,
                  type: course.courseType.name,
                  level: course.courseLevel.name,
                  instructor: course.courseInstructor.name,
                  totalModule: totalModule,
                  namePromo: promoName,
                  discount: discount,
                  totalPrice: totalPrice,
                  publishedAt: course.createdAt
                }
            })

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

    getCourseById: async (req, res) => {
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
                    courseInstructor: true,
                    courseModule: {
                        include: {
                            courseContent: {
                                orderBy: {
                                    sequence: 'asc'
                                  }
                            }
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

            let totalDurationModule = 0
                course.courseModule.map((module) => {
                    module.courseContent.map((content) => {
                        totalDurationModule += content.duration
                })
            })

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
                duration: totalDurationModule,
                taken: course.taken,
                imageUrl: course.imageUrl,
                category: course.courseCategory.name,
                type: course.courseType.name,
                level: course.courseLevel.name,
                instructor: course.courseInstructor.name,
                totalModule: totalModule,
                namePromo: promoName,
                discount: discount,
                totalPrice: totalPrice,
                publishedAt: course.createdAt,
                updatedAt: course.updatedAt,
                modules: course.courseModule.map((module) => {
                    const totalDurationContent = module.courseContent.reduce((total, content) => {
                        return total + content.duration
                    }, 0)

                    const totalContent = module.courseContent.length

                    return {
                        id: module.id,
                        title: module.title,
                        slug: module.slug,
                        duration: totalDurationContent, 
                        totalContent: totalContent,
                        contents: module.courseContent.map((content) => ({
                            id: content.id,
                            sequence: content.sequence,
                            title: content.title,
                            slug: content.slug,
                            urlVideo: content.videoUrl,
                            isFree: content.isFree,
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
    },

    // getAllCourseModuleByIdCourse: async (req, res) => {
    //     const { courseId } = req.params
    //     try {
    //         const modules = await db.courseModule.findMany({
    //             where: { 
    //                     courseId: parseInt(courseId), 
    //             },
    //             include: {
    //                 courseContent: {
    //                     orderBy: {
    //                         sequence: 'asc'
    //                       }
    //                 }
    //             }
    //         })

    //         const data = modules.map((module) => ({
    //             id: module.id,
    //             title: module.title,
    //             slug: module.slug,
    //             totalContent: module.totalChapter,
    //             courseId: module.courseId,
    //             contents: module.courseContent.map((content) => ({
    //                 id: content.id,
    //                 sequence: content.sequence,
    //                 title: content.title,
    //                 slug: content.slug,
    //                 duration: content.duration,
    //                 videoUrl: content.videoUrl,
    //                 isFree: content.isFree
    //             }))
    //         }))

            

    //         if (!modules) {
    //             return res.status(404).json({ message: 'Content not found' })
    //         }
    //         return res.json(data)
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ error: 'Internal server error' })
    //     }
    // },

    // getCourseModuleByIdAndCourseId: async (req, res) => {
    //     const { moduleId, courseId } = req.params
    //     try {
    //         const module = await db.courseModule.findUnique({
    //         where: {
    //             id: parseInt(moduleId),  
    //             courseId: parseInt(courseId), 
    //         },
    //             include: {
    //                 courseContent: {
    //                     orderBy: {
    //                         sequence: 'asc'
    //                       }
    //                 }
    //             }
    //         })

    //         const totalContent = module.courseContent.length

    //         const data = {
    //             id: module.id,
    //             sequence: module.sequence,
    //             id: module.id,
    //             title: module.title,
    //             slug: module.slug,
    //             totalContent: totalContent,
    //             courseId: module.courseId,
    //             contents: module.courseContent.map((content) => ({
    //                 id: content.id,
    //                 sequence: content.sequence,
    //                 title: content.title,
    //                 slug: content.slug,
    //                 duration: content.duration,
    //                 videoUrl: content.videoUrl,
    //                 isFree: content.isFree
    //             }))
    //         }


    //             if (!module) {
    //             return res.status(404).json({ message: 'Content not found' })
    //         }
    //         return res.json(data)
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ error: 'Internal server error' })
    //     }
    // },

    // getCourseContentByIdModuleAndCourse: async (req, res) => {
    //     const { contentId, moduleId, courseId } = req.params
    //     try {
    //         const courseContent = await db.courseContent.findFirst({
    //         where: {
    //             id: parseInt(contentId), 
    //             moduleId: parseInt(moduleId), 
    //             courseModule: {
    //             courseId: parseInt(courseId), 
    //             },
    //         },
    //         })
    //             if (!courseContent) {
    //             return res.status(404).json({ message: 'Content not found' })
    //         }
    //         return res.json(courseContent)
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ error: 'Internal server error' })
    //     }
    // },
}

//     if (popularByCategory) {
        //     const popularCourses = await db.course.findMany({
        //         where: filter,
        //         include: {
        //             courseCategory: true,
        //             courseLevel: true,
        //             courseType: true,
        //             coursePromo: true,
        //             courseInstructor: true,
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
        //             instructor: course.courseInstructor.name,
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