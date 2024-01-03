const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    filter = require('../../utils/filter'),
    imageKitFile = require('../../utils/imageKitFile')

module.exports = {
    getCourses: async(req, res) => {
        try {
            let { page = 1, limit = 10, search, category, level, type, popular, promo, latest, published } = req.query

            /* Pagination */
            let skip = ( page - 1 ) * limit

            /* Filter */
            let whereCondition = {}

            whereCondition = await filter.course.filterWhereCondition(whereCondition, search, category, level, type, promo, published)

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
                const discount = course.coursePromo ? course.coursePromo.discount : 0
                const totalModule = course.courseModule.length

                const ratings = course.courseTestimonial.map((testimonial) => testimonial.rating)
                const totalRatings = ratings.length
                const sumRatings = ratings.reduce((sum, rating) => sum + rating, 0)
                const averageRatings = totalRatings > 0 ? sumRatings / totalRatings : 0

                let totalDurationContent = 0
                course.courseModule.map((module) => {
                    module.courseContent.map((content) => {
                        totalDurationContent += content.duration
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
                  duration: totalDurationContent,
                  taken: course.taken,
                  imageUrl: course.imageUrl,
                  category: course.courseCategory ? course.courseCategory.name : null,
                  type: course.courseType ? course.courseType.name : null,
                  level: course.courseLevel ? course.courseLevel.name : null,
                  instructor: course.courseInstructor ? course.courseInstructor.name : null,
                  totalModule: totalModule,
                  isPromo: course.isPromo,
                  namePromo: promoName,
                  discount: discount,
                  totalPrice: totalPrice,
                  isPublished: course.isPublished,
                  publishedAt: course.createdAt
                }
            })

            /* Total Data & Total Page after Pagination */
            const resultCount = await db.course.count({ where: whereCondition }) 
            const totalPage = Math.ceil(resultCount / limit)

            if (resultCount === 0) {
                return res.status(404).json(utils.apiError("Tidak ada data course"))
            }

            const message = await filter.message.filterMessage({ search, category, level, type, promo, published, popular, latest })

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
                    courseDiscussion: true,
                    userCourse: {
                        include: {
                            userLearningProgress: true
                        }
                    },
                    /* courseModule: true,
                    courseContent: {
                        orderBy: {
                            sequence: 'asc'
                        }
                    } */
                    courseModule: {
                        include: {
                            courseContent: {
                                orderBy: {
                                    sequence: 'asc'
                                  }
                            }
                        }
                    },
                    courseContent: true
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

            /* const taken = course.userCourse.length  */

            /* const taken = course.userCourse.map((course) => ({
                courseId: course.courseId
            }))

            const totalTaken = taken.length */

            const requirementsString = course.requirements
            const requirementsArray = requirementsString.split(',').map(requirement => requirement.trim())
            const requirementsObjectsArray = requirementsArray.map((requirement, index) => {
                return {
                    id: parseInt(`${index + 1}`),
                    requirement: requirement
                };
            })
            
            let data = {
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
                categoryId: course.courseCategory ? course.courseCategory.id : null,
                category: course.courseCategory ? course.courseCategory.name : null,
                typeId: course.courseType ? course.courseType.id : null,
                type: course.courseType ? course.courseType.name : null,
                levelId: course.courseLevel ? course.courseLevel.id : null,
                level: course.courseLevel ? course.courseLevel.name : null,
                instructorId: course.courseInstructor ? course.courseInstructor.id : null,
                instructor: course.courseInstructor ? course.courseInstructor.name : null,
                totalModule: totalModule,
                namePromo: promoName,
                discount: discount,
                totalPrice: totalPrice,
                userCourseId: null,
                learningProgress: null,
                isPublished: course.isPublished,
                publishedAt: course.createdAt,
                updatedAt: course.updatedAt,
                courseDiscussionId: null,
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
                            isFinished: null
                        }))
                    }
                })
            }

            if(res.user) {
                const userCourse = await db.userCourse.findFirst({
                    where: {
                        userId: res.user.id,
                        courseId: parseInt(id)
                    }
                })

                if (userCourse) {

                    const userLearningProgress = await db.userLearningProgress.findMany({
                        where: {
                            userCourseId: userCourse.id,
                        }
                    })

                    data.userCourseId = userCourse.id
                    data.learningProgress = userCourse.progress
                    data.courseDiscussionId = course.courseDiscussionId

                    data.modules.forEach((module) => {
                        module.contents.forEach((content) => {
                            const status = userLearningProgress.find(progress => progress.contentId === content.contentId)
                            content.isFinished = status.isFinished
                        })
                    })
                } else {
                    data.userCourseId = null
                    data.learningProgress = null
                    data.courseDiscussionId = null
                    data.modules.forEach((module) => {
                        module.contents.forEach((content) => {
                            content.isFinished = null
                        })
                    })
                }
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

            const uploadFile = await imageKitFile.upload(courseImage)

            if(!uploadFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

            const category = await db.courseCategory.findUnique({
                where: {
                    id: parseInt(courseCategoryId)
                }
            })

            const categorySlug = category.slug 
            const cattegoryAbbrevation = categorySlug.split('-').map(word => word[0].toUpperCase()).join('')
            const randomCode = await utils.generateCodeCategory()
            const courseCode = `${cattegoryAbbrevation}-${randomCode}`

            const type = checkType.name

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
                    imageFilename: uploadFile.name,
                }
            })

            if (type === 'Premium') {
                const premiumDiscussion = await db.courseDiscussion.create({
                    data: {
                        name: `Forum Diskusi Kelas ${course.title}`,
                        course: {
                            connect: {
                                id: course.id 
                            }
                        }
                    }
                })
            }

            return res.status(201).json(utils.apiSuccess('Sukses membuat kelas', course))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    updateCourse: async(req, res) => {
        try {

            const { title, courseCategoryId, courseTypeId, courseLevelId, requirements, price, description, courseInstructorId, isPromo, isPublished } = req.body

            const courseId = parseInt(req.params.courseId)

            const checkCourse = await db.course.findUnique({
                where: {
                    id: courseId
                }
            })

            if(!checkCourse) return res.status(404).json(utils.apiError("Course tidak ditemukkan"))
            
            const checkTitle = await db.course.findFirst({
                where:{
                    title: title,
                    NOT: {
                        id: courseId
                    }
                }
            })

            if(checkTitle) return res.status(409).json(utils.apiError("Judul course sudah terdaftar"))

            const checkCategory = await db.courseCategory.findUnique({
                where:{
                    id: parseInt(courseCategoryId),
                }
            })

            if(!checkCategory) return res.status(404).json(utils.apiError("Kategori course tidak ditemukan"))

            const checkType = await db.courseType.findFirst({
                where:{
                    id: parseInt(courseTypeId),
                }
            })

            if(!checkType) return res.status(404).json(utils.apiError("Tipe course tidak ditemukan"))

            const checkLevel = await db.courseLevel.findFirst({
                where:{
                    id: parseInt(courseLevelId),
                }
            })

            if(!checkLevel) return res.status(404).json(utils.apiError("Level course tidak ditemukan"))

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

            let imageUrl = null;
            let imageFileName = null;

            if(typeof courseImage === 'undefined') {

                imageUrl = checkCourse.imageUrl
                imageFileName = checkCourse.imageFilename

            }else{

                if(!allowedMimes.includes(courseImage.mimetype)) return res.status(409).json(utils.apiError("Format gambar tidak diperbolehkan"))

                if((courseImage.size / (1024*1024)) > allowedSizeMb) return res.status(409).json(utils.apiError("Gambar kelas tidak boleh lebih dari 2mb"))

                if(checkCourse.imageFilename != null) {
                    const deleteFile = await imageKitFile.delete(checkCourse.imageFilename)
                    if(!deleteFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
                }

                const uploadFile = await imageKitFile.upload(courseImage)

                if(!uploadFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

                imageUrl = uploadFile.url
                imageFileName = uploadFile.name
            }
          
            const categorySlug = checkCategory.slug
            const cattegoryAbbrevation = categorySlug.split('-').map(word => word[0].toUpperCase()).join('')
            const randomCode = await utils.generateCodeCategory()
            const courseCode = `${cattegoryAbbrevation}-${randomCode}`

            await db.course.update({
                where: {
                    id: courseId
                },
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
                    imageUrl: imageUrl,
                    imageFilename: imageFileName,
                }
            })

            return res.status(201).json(utils.apiSuccess('Sukses mengubah kelas'))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    putPromoOnCourse: async(req, res) => {
        try {

            const {promoId} = req.body
            const courseId = parseInt(req.params.courseId)

            const checkPromo = await db.coursePromo.findUnique({
                where: {
                    id: promoId
                }
            })

            if(!checkPromo) return res.status(404).json(utils.apiError("Promo tidak ditemukkan"))

            await db.course.update({
                where: {
                    id: courseId
                },
                data: {
                    isPromo: true,
                    coursePromoId: promoId
                }
            })

            return res.status(200).json(utils.apiSuccess("Promo berhasil ditambahkan"))
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    cancelPromoOnCourse: async (req, res) => {
        try {

            const courseId = parseInt(req.params.courseId)

            const checkCourse = await db.course.findUnique({
                where: {
                    id: courseId
                }
            })

            if(!checkCourse) return res.status(404).json(utils.apiError("Course tidak ditemukkan"))

            await db.course.update({
                where: {
                    id: courseId
                },
                
                data: {
                    isPromo: false,
                    coursePromoId: null
                }
            })

            return res.status(200).json(utils.apiSuccess("Behasil menghapus promo pada course"))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    
    unpublishCourse: async(req, res) => {
        try {

            const courseId = parseInt(req.params.courseId)

            const publish = req.body.publish

            const checkCourse = await db.course.findUnique({
                where:{
                    id: courseId
                }
            })

            if(!checkCourse) return res.status(404).json(utils.apiError("Course tidak ditemukkan"))
            
            if(publish === 'true') {
                const course = await db.course.update({
                    where: {
                        id: courseId
                    },
                    data: {
                        isPublished: true
                    }
                })

                return res.status(201).json(utils.apiSuccess("Berhasil publish course", course))
            }

            if(publish === 'false') {
                const course = await db.course.update({
                    where: {
                        id: courseId
                    },
                    data: {
                        isPublished: false
                    }
                })

                return res.status(201).json(utils.apiSuccess("Berhasil unpublish course", course))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}
