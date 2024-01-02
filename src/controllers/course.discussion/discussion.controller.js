const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    imageKitFile = require('../../utils/imageKitFile')

module.exports = {

    createDiscussionByIdCourse: async (req, res) => {
        try {

            let uploadFileUrl
            let uploadFileName

            if(req.file) {

                const photoDiscussion = req.file
                const allowedMimes = [ "image/png","image/jpeg","image/jpg","image/webp" ]
                const allowedSizeMb = 2
    
                if(!allowedMimes.includes(photoDiscussion.mimetype)) return res.status(409).json(utils.apiError("Format gambar tidak diperbolehkan"))
    
                if((photoDiscussion.size / (1024*1024)) > allowedSizeMb) return res.status(409).json(utils.apiError("Gambar kategori tidak boleh lebih dari 2mb"))
    
                const uploadFile = await imageKitFile.upload(photoDiscussion)
    
                if(!uploadFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

                uploadFileUrl = uploadFile.url
                uploadFileName = uploadFile.name
            }
            
            const { title, question } = req.body
            const userId = res.user.id

            const course = await db.course.findFirst({
                where: {
                    id: parseInt(req.params.courseId)
                }
            })

            const courseDiscussioniId = course.courseDiscussionId

            console.log(courseDiscussioniId)

            const discussion = await db.discussion.create({
                data: {
                    title: title,
                    question: question,
                    courseDiscussionId: courseDiscussioniId,
                    userId: userId,
                    urlPhoto: uploadFileUrl,
                    imageFilename: uploadFileName
                }
            })

            return res.status(201).json(utils.apiSuccess("Berhasil membuat diskusi", discussion))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    updateDiscussionByIdCourse: async (req, res) => {
        try {
            const id = parseInt(req.params.id)

            const dicsussion = await db.discussion.findUnique({
                where: {
                    id: id,
                }
            })

            if (!dicsussion) return res.status(404).json(utils.apiError("Kategori Tidak di temukan"))

            const photoCategory = req.file

            const allowedMimes = ['image/png','image/jpeg','image/jpg','image/webp']

            const allowedSizeMb = 2

            let imageUrl = null
            let imageFileName = null

            if (typeof photoCategory === 'undefined') {

                imageUrl = dicsussion.urlPhoto
                imageFileName = dicsussion.imageFilename

            } else {
                if(!allowedMimes.includes(photoCategory.mimetype)) return res.status(409).json(utils.apiError("Format gambar tidak diperbolehkan"))
                if((photoCategory.size / (1024*1024)) > allowedSizeMb) return res.status(409).json(utils.apiError("Gambar tidak boleh lebih dari 2mb"))
                if(checkCategory.imageFileName != null) {
                    const deleteFile = await imageKitFile.delete(checkCategory.imageFileName)
                    if(!deleteFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
                }

                const uploadFile = await imageKitFile.upload(photoCategory)

                if(!uploadFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

                imageUrl = uploadFile.url
                imageFileName = uploadFile.name
            }

            const { title, question } = req.body
            const userId = res.user.id

            const courseDiscussionId = dicsussion.courseDiscussionId

            const discussion = await db.discussion.update({
                where: {
                    id: id
                },
                data: {
                    title: title,
                    question: question,
                    courseDiscussionId: courseDiscussionId,
                    userId: userId,
                    urlPhoto: imageUrl,
                    imageFilename: imageFileName
                }
            })


            return res.status(201).json(utils.apiSuccess("Berhasil update data diskusi", discussion))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    getDiscussionById: async (req, res) => {
        try {


            const id = res.user.id
            const roleName = res.user.roleName

            let currentUserName = null

            if(roleName === 'user') {
                const user = await db.user.findFirst({
                    where: {
                        id: id
                    }
                })

                currentUserName = user.name
            }

            if(roleName === 'instructor') {
                const user = await db.courseInstructor.findFirst({
                    where: {
                        id: id
                    }
                })

                currentUserName = user.name
            }

            const discussionId = req.params.id

            const discussion = await db.discussion.findFirst({
                where: {
                    id: parseInt(discussionId)
                },
                include: {
                    user: true,
                    courseDiscussion: {
                        include: {
                            course: true
                        }
                    },
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
                urlPhoto: discussion.urlPhoto,
                question: discussion.question,
                closed: discussion.closed,
                userId: discussion.user.id,
                username: discussion.user.name,
                userPhoto: discussion.user.photoProfile,
                courseId: discussion.courseDiscussion.course.id,
                courseDiscussionId: discussion.courseDiscussionId,
                courseDiscussionName: discussion.courseDiscussion.name,
                createdAt: discussion.createdAt,
                updatedAt: discussion.updatedAt,
                commentars: discussion.commentar.map((comment) => ({
                    commentarId: comment.id,
                    commentar: comment.commentar,
                    currentUserName: currentUserName,
                    photoCommentar: comment.urlPhoto,
                    userId: comment.userId,
                    username: comment.user ? comment.user.name : null,
                    userPhoto: comment.user ? comment.user.photoProfile : null,
                    instructorId: comment.instructorId,
                    instructorName: comment.instructor ? comment.instructor.name : null,
                    instructorPhoto: comment.instructor ? comment.instructor.photoProfile : null,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt
                }))
            }

            let message
            if( res.user.roleName === 'admin') {
               message = 'admin'
            }

            if( res.user.roleName === 'instructor') {
               message = 'instructor'
            }

            if( res.user.roleName === 'user') {
               message = 'user'
            }

            return res.status(200).json(utils.apiSuccess(message, data))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    closedDiscussionById: async (req, res) => {
        try {
            const { discussionId } = req.body
            await db.discussion.update({
                where: {
                    id: parseInt(discussionId)
                }, data: {
                    closed: true
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil menutup ruang diskusi"))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }

    }
}