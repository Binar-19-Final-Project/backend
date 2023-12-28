const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {
    createTestimonial: async (req, res) => {
        try {
            const id = res.user.id
            const { testimonial, rating } = req.body
            const { courseId } = req.params

            const checkCourse = await db.course.findFirst({
                where: {
                    id: parseInt(courseId)
                }
            })

            if(!checkCourse) return res.status(404).json(utils.apiError('Kelas tidak ditemukan'))

            const checkTestimonial = await db.courseTestimonial.findFirst({
                where: {
                    courseId: parseInt(courseId),
                    userId: id
                }
            })

            if(checkTestimonial) return res.status(409).json(utils.apiError('Anda sudah memberikan testimoni dan rating untuk kelas ini'))

            const createTestimoni = await db.courseTestimonial.create({
                data: {
                    testimonial: testimonial,
                    rating: parseFloat(rating),
                    userId: id,
                    courseId: parseInt(courseId)
                }
            }) 

            return res.status(201).json(utils.apiSuccess("Berhasil memberikan testimoni dan rating untuk kelas ini", createTestimoni))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    readTestimonialByCourseId: async (req, res) => {
        try {
            const { courseId } = req.params

            const testimonials = await db.courseTestimonial.findMany({
                where: {
                    courseId: parseInt(courseId)
                },
                include: {
                    user: true,
                    course: true
                }
            })

            const data = testimonials.map((testimonial) => {
                const userName = testimonial.user.name
                const userPhotoProfile = testimonial.user.photoProfile
                
                return {
                    testimoialId: testimonial.id,
                    testimonial: testimonial.testimonial,
                    rating: testimonial.rating,
                    userName: userName,
                    userPhotoProfile: userPhotoProfile,
                    courseId: testimonial.course.id
                }
            })

            return res.status(200).json(utils.apiSuccess('Behasil mengambil data testimonial berdasarkan course', data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },
    
    updateTestimonial: async(req, res) => {
        try {

            const id = parseInt(req.params.testimonialId)
            const courseId = parseInt(req.params.courseId)

            const { testimonial, rating } = req.body

            const checkTestimonial = await db.courseTestimonial.findFirst({
                where: {
                    id: id,
                    userId: res.user.id,
                    courseId: courseId
                }
            })

            if(!checkTestimonial) return res.status(404).json(utils.apiError('Testimonial tidak ditemukkan'))

            await db.courseTestimonial.update({
                where: {
                    id: id,
                    userId: res.user.id,
                    courseId: courseId
                },
                data:{                    
                    testimonial: testimonial,
                    rating: parseFloat(rating)
                }
            })

            return res.status(201).json(utils.apiSuccess("Berhasil mengubah testimoni dan rating untuk kelas ini", createTestimoni))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}