const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {

    getAllCourseDiscussion: async (req, res) => {
        try {
            const courseDiscussions = await db.courseDiscussion.findMany()

            return res.status(200).json(utils.apiSuccess("Sukses mengambil semua data course diskusi", courseDiscussions))
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
                            dicsussion: true
                        }
                    }
                }
            })

            const data = {
                courseId: course.id,
                courseDiscussionId: course.courseDiscussion.id,
                courseDiscussionName: course.courseDiscussion.name,
                discussion: course.courseDiscussion.dicsussion.map((discuss => ({
                    discussionId: discuss.id,
                    title: discuss.title,
                    question: discuss.question,
                    closed: discuss.closed,
                    cretedAt: discuss.createdAt,
                    courseDiscussionId: discuss.courseDiscussionId
                })))
            }

            return res.status(200).json(utils.apiSuccess("Sukses mengambil semua data course diskusi", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    getCourseDiscussionByIdInstructor: async (req, res) => {

    },

}