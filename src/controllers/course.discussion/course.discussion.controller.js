const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')
const { course } = require('../../validation/course.schema')

module.exports = {

    getAllCourseDiscussion: async (req, res) => {
        try {

            const roleName = res.user.roleName

            let courseDiscussions
            let message = 'Sukses mengambil semua data ruang diskusi '

            if(roleName === 'admin') {
                const courses = await db.course.findMany({
                    include: {
                         courseDiscussion: {
                            include: {
                                dicsussion: true
                            }
                         }
                    }   
                })

                courseDiscussions = courses.filter((course) => course.courseDiscussion).map((course) => {

                    const totalDiscussion = course.courseDiscussion.dicsussion.length
                    const activeDiscussion = course.courseDiscussion.dicsussion.filter((discussion) => !discussion.closed).length

                    return {
                        courseId: course.id,
                        courseName: course.title,
                        courseInstructorId: course.courseInstructorId,
                        courseDiscussionId: course.courseDiscussion.id,
                        courseDiscussionName: course.courseDiscussion.name,
                        totalDiscussion: totalDiscussion,
                        activeDiscussion: activeDiscussion,
                    }
                })


                message += `menggunakan akun 'admin' `
            }

            if (roleName === 'instructor' ) {
                const instructorId = res.user.id

                const courses = await db.course.findMany({
                    where: {
                        courseInstructorId: instructorId
                    },
                    include: {
                         courseDiscussion: {
                            include: {
                                dicsussion: true
                            }
                         }
                    }   
                })

                if (!courses || !courses.length) {
                    return res.status(404).json(utils.apiError("Tidak ada data course"));
                  }
                  
                  courseDiscussions = courses
                    .filter((course) => course.courseDiscussion !== null)
                    .map((course) => {

                        const totalDiscussion = course.courseDiscussion.dicsussion.length
                        const activeDiscussion = course.courseDiscussion.dicsussion.filter((discussion) => !discussion.closed).length

                        return {
                            courseId: course.id,
                            courseName: course.title,
                            courseInstructorId: course.courseInstructorId,
                            courseDiscussionId: course.courseDiscussion.id,
                            courseDiscussionName: course.courseDiscussion.name,
                            totalDiscussion: totalDiscussion,
                            activeDiscussion: activeDiscussion
                        }
                    })

                message += `berdasarkan id 'instructor' `
            }

            return res.status(200).json(utils.apiSuccess(message, courseDiscussions))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    getCourseDiscussionByIdCourse: async (req, res) => {
        try {

            const courseId = req.params.courseId

            const course = await db.course.findFirst({
                where: {
                    id: parseInt(courseId)
                },
                include: {
                    courseDiscussion: {
                        include: {
                            dicsussion: {
                                include: {
                                    commentar: true
                                }
                            }
                        }
                    }
                }
            })

            const data = {
                courseId: course.id,
                courseDiscussionId: course.courseDiscussion.id,
                courseDiscussionName: course.courseDiscussion.name,
                discussion: course.courseDiscussion.dicsussion.map((discuss) => {
                    const totalComments = discuss.commentar.length
                    return {
                        discussionId: discuss.id,
                        title: discuss.title,
                        question: discuss.question,
                        closed: discuss.closed,
                        totalComments: totalComments,
                        cretedAt: discuss.createdAt,
                        courseDiscussionId: discuss.courseDiscussionId
                    }
                })
            }

            let message = 'Berhasil mengambil data diskusi berdasarkan id '

            if( res.user.roleName === 'admin') {
                message += `menggunakan akun 'admin' `
            }

            if( res.user.roleName === 'instructor') {
                message += `menggunakan akun 'instructor' `
            }

            if( res.user.roleName === 'user') {
                message += `menggunakan akun 'user' `
            }

            return res.status(200).json(utils.apiSuccess(message, data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    getCourseDiscussionByIdInstructor: async (req, res) => {
        try {

            const instructorId = res.user.id

            const courses = await db.course.findMany({
                where: {
                   courseInstructorId: instructorId
                },
                include: {
                    courseDiscussion: true
                }
            })

            const data = courses.map((course) => ({
                    courseId: course.id,
                    courseName: course.title,
                    courseDiscussionId: course.courseDiscussion.id,
                    courseDiscussionName: course.courseDiscussion.name
            }))
            

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

}