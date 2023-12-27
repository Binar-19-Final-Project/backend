const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {

    createCommentarByIdDiscussion: async (req, res) => {
        try {
            
            const { commentar, discussionId } = req.body
            const userId = res.user.id

            const checkDiscussion = await db.discussion.findFirst({
                where: {
                    id: parseInt(discussionId)
                }
            })

            if(!checkDiscussion) return res.status(404).json(utils.apiError("Diskusi tidak ditemukan"))

            const discussionCommentar = await db.discussionCommentar.create({
                data: {
                   commentar: commentar,
                   discussionId: parseInt(discussionId),
                   userId: parseInt(userId)
                }
            })

            return res.status(201).json(utils.apiSuccess("Berhasil membuat diskusi", discussionCommentar))

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
                    commentar: true
                }
            })

            return res.status(200).json(utils.apiSuccess(discussion))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    }

}