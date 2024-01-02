const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

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

            let { page = 1, limit = 10, closed, active, search } = req.query

            /* Pagination */
            let skip = ( page - 1 ) * limit

            /* Filter */
            let whereCondition = {}

            if (search) {
                whereCondition = {
                    ...whereCondition,
                    title: {
                        contains: search
                    }
                }
            }

            if (closed) {
                whereCondition = {
                    ...whereCondition,
                    closed: true
                }
            }

            if (active) {
                whereCondition = {
                    ...whereCondition,
                    closed: false
                }
            }
            
            const courseId = req.params.courseId

            const course = await db.course.findFirst({
                where: {
                    id: parseInt(courseId)
                },
                include: {
                    courseDiscussion: {
                        include: {
                            dicsussion: {
                                where: whereCondition,
                                include: {
                                    user: true,
                                    commentar: true
                                },
                                take: parseInt(limit),
                                skip: skip
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
                        username: discuss.user.name,
                        userPhoto: discuss.user.photoProfile,
                        question: discuss.question,
                        closed: discuss.closed,
                        totalComments: totalComments,
                        cretedAt: discuss.createdAt,
                        courseDiscussionId: discuss.courseDiscussionId
                    }
                })
            }


            const totalData = await db.discussion.count({
                where: whereCondition,
            });
            
            const totalPage = Math.ceil(totalData / limit);

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

            if (active) {
                message += `berdasarkan status active`
            } 

            if (closed) {
                message += `berdasarkan status closed`
            } 

            if (search) {
                message += `berdasarkan kata kunci pencarian ${search}`
            }

            return res.status(200).json(utils.apiSuccess(
                message, 
                data,
                {   
                    currentPage: parseInt(page),
                    totalPage: totalPage,
                    totalData: totalData
                }
            ))
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