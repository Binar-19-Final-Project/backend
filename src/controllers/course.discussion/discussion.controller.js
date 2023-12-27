const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {

    createDiscussionByIdCourse: async (req, res) => {
        try {
            
            const { title, question, courseDiscussionId } = req.body
            const userId = res.user.id

            const discussion = await db.discussion.create({
                data: {
                    title: title,
                    question: question,
                    courseDiscussionId: parseInt(courseDiscussionId),
                    userId: userId,
                }
            })

            return res.status(201).json(utils.apiSuccess("Berhasil membuat diskusi", discussion))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    getDiscussionById: async (req, res) => {
        try {

            const discussionId = req.params.id

            const discussion = await db.discussion.findFirst({
                where: {
                    id: parseInt(discussionId)
                },
                include: {
                    user: true,
                    courseDiscussion: true,
                    commentar: {
                        include: {
                            user: true,
                            instructor: true
                        }
                    }
                }
            })

            if(!discussion) return res.status(404).json(utils.apiError("Diskusi tidak ditemukan"))

            const data = {
                discussionId: discussion.id,
                title: discussion.title,
                question: discussion.question,
                closed: discussion.closed,
                userId: discussion.userId,
                username: discussion.user.name,
                userPhoto: discussion.user.photoProfile,
                courseDiscussionId: discussion.courseDiscussionId,
                courseDiscussionName: discussion.courseDiscussion.name,
                createdAt: discussion.createdAt,
                updatedAt: discussion.updatedAt,
                commentars: discussion.commentar.map((comment) => ({
                    commentarId: comment.id,
                    commentar: comment.commentar,
                    userId: comment.userId,
                    username: comment.user ? comment.user.name : null,
                    instructorId: comment.instructorId,
                    instructorName: comment.instructor ? comment.instructor.name : null,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt
                }))
            }

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data diskusi berdasarkan id", data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    }

}