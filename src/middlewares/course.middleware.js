const db = require('../../prisma/connection'),
    utils = require('../utils/utils'),
     jwt = require("jsonwebtoken"),
    { JWT_SECRET_KEY } = require('../config')

const getCourseMiddleware = async (req, res, next) => {
    try {
        if (req.headers["authorization"]) {
            const authHeader = req.headers["authorization"]
        if (!authHeader) return res.status(401).json(utils.apiError("Silahkan login terlebih dahulu"))
        
        const token = authHeader && authHeader.split(" ")[1]
        if (!token) return res.status(401).json(utils.apiError("Silahkan login terlebih dahulu"))

        const jwtPayload = jwt.verify(token, JWT_SECRET_KEY)
        if (!jwtPayload) {
        return res.status(401).json(utils.apiError("Token tidak valid. Silahkan login ulang"))
        }
        
        res.user = jwtPayload

        return next()
        } else {
            return next()
        }
  } catch (error) {
    console.log(error)
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(utils.apiError("Token kedaluwarsa, silahkan login ulang"))
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(utils.apiError("Token tidak valid. Silahkan login ulang"))
    } else {
      return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
    }
    
  }
}

const courseTestimonialMiddleware = async (req, res, next) => {

    const { courseId } = req.params
    if (!courseId) return res.status(422).json(utils.apiError("Params courseId tidak boleh kosong"))
    
    const checkCourse = await db.course.findFirst({
        where: {
            id: parseInt(courseId)
        }
    })
    if(!checkCourse) return res.status(404).json(utils.apiError("Course tidak ditemukan"))

    const userCourse = await db.userCourse.findFirst({
        where: {
            userId: res.user.id,
            courseId: parseInt(courseId)
        }
    })
    if(!userCourse) return res.status(403).json(utils.apiError("Akses tidak diperbolehkan. User tidak mempunyai course ini"))
    
    const status = userCourse.status

    if(status === 'Selesai') {
        return next()
    } else {
        return res.status(403).json(utils.apiError("Akses tidak diperbolehkan. Anda belum menyelesaikan course ini"))
    }
}

const courseCertificate = async (req, res, next) => {

    const courseId = req.params.courseId

    const course = await db.course.findFirst({
        where: {
            id: parseInt(courseId)
        },
        include: {
            courseType: true
        }
    })

    if(!course) return res.status(404).json(utils.apiError("Course tidak ditemukan"))

    const typeCourse = course.courseType.name

    if(typeCourse === 'Free') return res.status(404).json(utils.apiError("Tidak ada sertifikat untuk course ini"))

    const userCourse = await db.userCourse.findFirst({
        where: {
            userId: res.user.id,
            courseId: parseInt(courseId)
        }
    })

    if(!userCourse) return res.status(403).json(utils.apiError("Akses tidak diperbolehkan. User tidak mempunyai course ini"))

    const certificate = await db.certificate.findFirst({
        where: {
            courseId: parseInt(courseId),
            userId: res.user.id,
        }
    })

    if(certificate) return res.status(403).json(utils.apiError("User sudah mencetak sertifikat untuk course ini"))

    const userTestimonial = await db.courseTestimonial.findFirst({
        where: {
            userId: res.user.id,
            courseId: parseInt(courseId)
        }
    })

    if(userTestimonial) {
        return next()
    } else {
        return res.status(403).json(utils.apiError("Akses tidak diperbolehkan. Mohon berikan rating dan testimoni course ini terlebih dahulu"))
    }
}

const getCourseCertificate = async (req, res, next) => {

    const courseId = req.params.courseId

    const course = await db.course.findFirst({
        where: {
            id: parseInt(courseId)
        },
        include: {
            courseType: true
        }
    })

    if(!course) return res.status(404).json(utils.apiError("Course tidak ditemukan"))

    const typeCourse = course.courseType.name

    if(typeCourse === 'Free') return res.status(404).json(utils.apiError("Tidak ada sertifikat untuk course ini"))

    const userCourse = await db.userCourse.findFirst({
        where: {
            userId: res.user.id,
            courseId: parseInt(courseId)
        }
    })

    if(!userCourse) return res.status(403).json(utils.apiError("Akses tidak diperbolehkan. User tidak mempunyai course ini"))

    const userTestimonial = await db.courseTestimonial.findFirst({
        where: {
            userId: res.user.id,
            courseId: parseInt(courseId)
        }
    })

    if(userTestimonial) {
        return next()
    } else {
        return res.status(403).json(utils.apiError("Akses tidak diperbolehkan. Mohon berikan rating dan testimoni course ini terlebih dahulu"))
    }
}

/* const courseContentMiddleware = async (req, res, next) => {
    try {
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

    
        if(content) {
            if(content.isDemo === true) {
                return next()
            } else if(userCourse || user.roleName === 'admin') {
                return next() 
            } else {
                return res.status(403).json(utils.apiError("Silahkan ambil atau order kelas ini terlebih dahulu"))
            }
        } else {
            return res.status(404).json(utils.apiError("Content tidak ditemukan"))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
    }
} */

const courseContentMiddleware = async (req, res, next) => {
    try {
        const content = await db.courseContent.findFirst({
            where: {
                id: parseInt(req.params.contentId), 
                moduleId: parseInt(req.params.moduleId), 
                courseModule: {
                    courseId: parseInt(req.params.courseId),
                },
            },
            include: {
                courseModule: {
                    include: {
                        course: true
                    }
                }
            }
        })

        if (!content) {
            return res.status(404).json(utils.apiError("Content tidak ditemukan"))
        }

        if (content.isDemo === true) {
            return next()
        }

        const authHeader = req.headers["authorization"]
        if (!authHeader) return res.status(401).json(utils.apiError("Silahkan login terlebih dahulu"))
        
        const token = authHeader && authHeader.split(" ")[1]
        if (!token) return res.status(401).json(utils.apiError("Silahkan login terlebih dahulu"))

        const jwtPayload = jwt.verify(token, JWT_SECRET_KEY)
        if (!jwtPayload) {
            return res.status(401).json(utils.apiError("Token tidak valid. Silahkan login ulang"))
        }
            
        res.user = jwtPayload

        const userId = res.user.id
        const roleName = res.user.roleName
        const courseId = req.params.courseId

        if(roleName === 'admin') {
            return next()
        }

        if(roleName === 'user') {

            const userCourse = await db.userCourse.findFirst({
                where: {
                    userId: userId,
                    courseId: parseInt(courseId)
                }
            })

            if(userCourse) {
                return next()
            } else {
                return res.status(403).json(utils.apiError("Akses tidak diperbolehkan. Silahkan order atau enroll kelas terlebih dahulu"))
            }

        }

        if(roleName === 'instructor') {
            const course = await db.course.findFirst({
                where: {
                    id: parseInt(courseId)
                }
            })

            const courseInstructorId = course.courseInstructorId

            const courseInstructor = await db.courseInstructor.findFirst({
                where: {
                    id: courseInstructorId
                }
            })

            if(courseInstructor) {
                return next()
            } else {
                return res.status(403).json(utils.apiError("Akses tidak diperbolehkan."))
            }
        }

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
}

const courseDiscussionMiddleware = async (req, res, next) => {
    try {
        const userId = res.user.id
    const roleName = res.user.roleName
    const courseId = req.params.courseId

    if(roleName === 'admin') {
        return next()
    }

    if(roleName === 'user') {
        
        const course = await db.course.findFirst({
            where: {
                id: parseInt(courseId)
            }
        })

        if(!course) return res.status(404).json(utils.apiError("Course tidak ada"))

        const courseDiscussion = course.courseDiscussionId

        if(courseDiscussion === null) return res.status(404).json(utils.apiError("Tidak ada ruang diskusi pada course ini"))

        const userCourse = await db.userCourse.findFirst({
            where: {
                userId: userId,
                courseId: parseInt(courseId)
            }
        })

        if(userCourse) {
            return next()
        } else {
            return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))
        }

    }

    if(roleName === 'instructor') {
        const course = await db.course.findFirst({
            where: {
                id: parseInt(courseId)
            }
        })

        const courseInstructorId = course.courseInstructorId

        const courseInstructor = await db.courseInstructor.findFirst({
            where: {
                id: courseInstructorId
            }
        })

        if(courseInstructor) {
            return next()
        } else {
            return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))
        }
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
    }

}

const discussionMiddleware = async (req, res, next) => {
    try {
    const userId = res.user.id
    const roleName = res.user.roleName
    const courseId = req.params.courseId

    if(roleName === 'user') {
        
        const course = await db.course.findFirst({
            where: {
                id: parseInt(courseId)
            }
        })

        if(!course) return res.status(404).json(utils.apiError("Course tidak ada"))

        const courseDiscussion = course.courseDiscussionId

        if(courseDiscussion === null) return res.status(404).json(utils.apiError("Tidak ada ruang diskusi pada course ini"))

        const userCourse = await db.userCourse.findFirst({
            where: {
                userId: userId,
                courseId: parseInt(courseId)
            }
        })

        if(userCourse) {
            return next()
        } else {
            return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))
        }

    } else {
        return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))
    }

    } catch (error) {
        console.log(error)
        return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
    }
}

const commentarDiscussionMiddleware = async (req, res, next) => {
    try {
        const userId = res.user.id
    const roleName = res.user.roleName
    const courseId = req.params.courseId

    if(roleName === 'user') {
        
        const course = await db.course.findFirst({
            where: {
                id: parseInt(courseId)
            }
        })

        if(!course) return res.status(404).json(utils.apiError("Course tidak ada"))

        const courseDiscussion = course.courseDiscussionId

        if(courseDiscussion === null) return res.status(404).json(utils.apiError("Tidak ada ruang diskusi pada course ini"))

        const userCourse = await db.userCourse.findFirst({
            where: {
                userId: userId,
                courseId: parseInt(courseId)
            }
        })

        if(userCourse) {
            return next()
        } else {
            return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))
        }

    }

    if(roleName === 'instructor') {
        const course = await db.course.findFirst({
            where: {
                id: parseInt(courseId)
            }
        })

        const courseInstructorId = course.courseInstructorId

        const courseInstructor = await db.courseInstructor.findFirst({
            where: {
                id: courseInstructorId
            }
        })

        if(courseInstructor) {
            return next()
        } else {
            return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))
        }
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
    }

}


module.exports = { getCourseCertificate, getCourseMiddleware, courseTestimonialMiddleware, courseContentMiddleware, courseDiscussionMiddleware, discussionMiddleware, commentarDiscussionMiddleware, courseCertificate }
