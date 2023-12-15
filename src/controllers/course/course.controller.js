const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    filter = require('../../utils/filter'),
    imageKit = require('../../utils/imageKit')

module.exports = {
    getCourses: async(req, res) => {
        try {
            let { page = 1, limit = 10, search, category, level, type, popular, promo, latest } = req.query

            /* Pagination */
            let skip = ( page - 1 ) * limit

            /* Filter */
            let whereCondition = {}

            whereCondition = await filter.course.filterWhereCondition(whereCondition, search, category, level, type, promo)

            /* Order By */
            const orderBy = await filter.course.filterOrderBy(popular, latest)

            const courses = await db.course.findMany({
                take: parseInt(limit),
                skip: skip,
                where: whereCondition,
                include: {
                    courseCategory: true,
                    courseLevel: true,
                    courseType: true,
                    coursePromo: true,
                    courseInstructor: true,
                    courseTestimonial: true,
                    userCourse: true,
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

                const ratings = course.courseTestimonial.map((testimonial) => testimonial.rating)
                const totalRatings = ratings.length
                const sumRatings = ratings.reduce((sum, rating) => sum + rating, 0)
                const averageRatings = totalRatings > 0 ? sumRatings / totalRatings : 0

                /* const taken = course.userCourse.length */

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
                  code: course.code,
                  slug: course.slug,
                  description: course.description,
                  originalPrice: originalPrice,
                  rating: averageRatings,
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
            const resultCount = await db.course.count({ where: whereCondition }) 
            const totalPage = Math.ceil(resultCount / limit)

            if (resultCount === 0) {
                return res.status(404).json(utils.apiError("Tidak ada data course"))
            }

            const message = await filter.message.filterMessage({ search, category, level, type, promo, popular, latest })

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
                    courseTestimonial: true,
                    userCourse: true,
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

            const ratings = course.courseTestimonial.map((testimonial) => testimonial.rating)
            const totalRatings = ratings.length
            const sumRatings = ratings.reduce((sum, rating) => sum + rating, 0)
            const averageRatings = totalRatings > 0 ? sumRatings / totalRatings : 0

            /* const taken = course.userCourse.length */

            const requirementsString = course.requirements
            const requirementsArray = requirementsString.split(',').map(requirement => requirement.trim())
            const requirementsObjectsArray = requirementsArray.map((requirement, index) => {
                return {
                    id: parseInt(`${index + 1}`),
                    requirement: requirement
                };
            })
            
            const data = {
                courseId: course.id,
                title: course.title,
                code: course.code,
                slug: course.slug,
                description: course.description,
                originalPrice: originalPrice,
                rating: averageRatings,
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
                groupDiscussion: "https://t.me/+c0MZsCGj2jIzZjdl",
                requirements: requirementsObjectsArray,
                modules: course.courseModule.map((module) => {
                    const totalDurationContent = module.courseContent.reduce((total, content) => {
                        return total + content.duration
                    }, 0)

                    const totalContent = module.courseContent.length

                    return {
                        moduleId: module.id,
                        title: module.title,
                        slug: module.slug,
                        duration: totalDurationContent, 
                        totalContent: totalContent,
                        contents: module.courseContent.map((content) => ({
                            contentId: content.id,
                            sequence: content.sequence,
                            title: content.title,
                            slug: content.slug,
                            isDemo: content.isDemo,
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

    createCourse: async(req, res) => {
        try {
            const { title, courseCategoryId, courseTypeId, courseLevelId, requirements, price, description, courseInstructorId, isPromo = false, isPublished } = req.body

            const checkTitle = await db.course.findFirst({
                where:{
                    title: title,
                }
            })

            if(checkTitle) return res.status(409).json(utils.apiError("Judul course sudah terdaftar"))

            const checkCategory = await db.courseCategory.findFirst({
                where:{
                    id: parseInt(courseCategoryId),
                }
            })

            if(!checkCategory) return res.status(404).json(utils.apiError("Kategori tidak ditemukan"))

            const checkType = await db.courseType.findFirst({
                where:{
                    id: parseInt(courseTypeId),
                }
            })

            if(!checkType) return res.status(404).json(utils.apiError("Tipe tidak ditemukan"))

            const checkLevel = await db.courseLevel.findFirst({
                where:{
                    id: parseInt(courseLevelId),
                }
            })

            if(!checkLevel) return res.status(404).json(utils.apiError("Level tidak ditemukan"))

            const checkInstructor = await db.courseInstructor.findFirst({
                where:{
                    id: parseInt(courseInstructorId),
                }
            })

            if(!checkInstructor) return res.status(404).json(utils.apiError("Instructor tidak ditemukan"))

            const slug = await utils.createSlug(title)

            const courseImage = req.file
            const allowedMimes = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/webp'
            ]
            const allowedSizeMb = 2

            if(typeof courseImage === 'undefined') return res.status(422).json(utils.apiError("Gambar kelas tidak boleh kosong"))

            if(!allowedMimes.includes(courseImage.mimetype)) return res.status(409).json(utils.apiError("Format gambar tidak diperbolehkan"))

            if((courseImage.size / (1024*1024)) > allowedSizeMb) return res.status(409).json(utils.apiError("Gambar kelas tidak boleh lebih dari 2mb"))

            const stringFile = courseImage.buffer.toString('base64')
            const originalFileName = courseImage.originalname

            const uploadFile = await imageKit.upload({
                fileName: originalFileName,
                file: stringFile
            })

            const category = await db.courseCategory.findUnique({
                where: {
                    id: parseInt(courseCategoryId)
                }
            })

            const categorySlug = category.slug // android-development
            const cattegoryAbbrevation = categorySlug.split('-').map(word => word[0].toUpperCase()).join('')
            const randomCode = await utils.generateCodeCategory()
            const courseCode = `${cattegoryAbbrevation}-${randomCode}`


            const course = await db.course.create({
                data: {
                    title: title,
                    slug: slug,
                    code: courseCode,
                    description: description,
                    requirements: requirements,
                    price: parseFloat(price),
                    courseInstructorId: parseInt(courseInstructorId),
                    courseCategoryId: parseInt(courseCategoryId),
                    courseTypeId: parseInt(courseTypeId),
                    courseLevelId: parseInt(courseLevelId),
                    isPromo: Boolean(isPromo),
                    isPublished: Boolean(isPublished),
                    imageUrl: uploadFile.url,
                    imageFilename: originalFileName,
                }
            })

            return res.status(201).json(utils.apiSuccess('Sukses', course))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}
