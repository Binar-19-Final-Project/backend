const db = require('../../prisma/connection'),
    utils = require('../utils/utils'),
     jwt = require("jsonwebtoken"),
    { JWT_SECRET_KEY } = require('../config')

const getCourseMiddleware = async (req, res, next) => {
    try {
        if (req.headers["authorization"]) {
            const authHeader = req.headers["authorization"]
            const token = authHeader && authHeader.split(" ")[1]

            const jwtPayload = jwt.verify(token, JWT_SECRET_KEY)

            res.user = jwtPayload

            return next()
        } else {
            return next()
        }
  } catch (error) {
    console.log(error)
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json(utils.apiError("Silahkan login ulang"))
    } else {
        return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
    }
    
  }
}

const courseTestimonialMiddleware = async (req, res, next) => {
    const userCourse = await db.userCourse.findFirst({
        where: {
            userId: res.user.id,
            courseId: parseInt(req.params.courseId)
        }
    })

    const status = userCourse.status === 'Selesai'

    if(status) {
        return next()
    } else {
        return res.status(403).json(utils.apiError("Anda belum menyelesaikan course ini"))
    }
}

const courseCertificate = async (req, res, next) => {
    const userTestimonial = await db.courseTestimonial.findFirst({
        where: {
            userId: res.user.id,
            courseId: parseInt(courseId)
        }
    })

    if(userTestimonial) {
        return next()
    } else {
        return res.status(403).json(utils.apiError("Mohon berikan rating dan testimoni course ini terlebih dahulu"))
    }
}

const courseContentMiddleware = async (req, res, next) => {
    const userCourse = await db.userCourse.findFirst({
        where: {
            userId: res.user.id,
            courseId: parseInt(req.params.courseId)
        }
    })

    const content = await db.courseContent.findFirst({
        where: {
            id: parseInt(req.params.contentId), 
            moduleId: parseInt(req.params.moduleId), 
            courseModule: {
                    courseId: parseInt(req.params.courseId),
                },
        },
        include: {
            courseModule: true,
            courseModule: {
                include: {
                    course: true
                }
            }
        }
    })

    const user = await db.user.findUnique({
        where: {
            id: res.user.id
        }
    })

    const role = await db.role.findUnique({
        where: {
            id: user.roleId
        }
    })


    if(content) {
        if(content.isDemo === true) {
            return next()
        } else if(userCourse || role.name === 'admin') {
            return next() 
        } else {
            return res.status(403).json(utils.apiError("Silahkan ambil atau order kelas ini terlebih dahulu"))
        }
    } else {
        return res.status(404).json(utils.apiError("Content tidak ditemukan"))
    }
}


module.exports = { getCourseMiddleware, courseTestimonialMiddleware, courseContentMiddleware }
