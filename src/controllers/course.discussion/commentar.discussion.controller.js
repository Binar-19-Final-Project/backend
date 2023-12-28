const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    imageKitFile = require('../../utils/imageKitFile')

module.exports = {

    createCommentarByIdDiscussion: async (req, res) => {
        try {

            let uploadFileUrl
            let uploadFileName

            if(req.file) {

                const photoCommentar = req.file
                const allowedMimes = [ "image/png","image/jpeg","image/jpg","image/webp" ]
                const allowedSizeMb = 2
    
                if(!allowedMimes.includes(photoCommentar.mimetype)) return res.status(409).json(utils.apiError("Format gambar tidak diperbolehkan"))
    
                if((photoCommentar.size / (1024*1024)) > allowedSizeMb) return res.status(409).json(utils.apiError("Gambar kategori tidak boleh lebih dari 2mb"))
    
                const uploadFile = await imageKitFile.upload(photoCommentar)
    
                if(!uploadFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

                uploadFileUrl = uploadFile.url
                uploadFileName = uploadFile.name
            }
            
            const { commentar, discussionId } = req.body
            const userId = res.user.id

            const roleName = res.user.roleName
            
            const checkDiscussion = await db.discussion.findFirst({
                where: {
                    id: parseInt(discussionId)
                }
            })

            if(!checkDiscussion) return res.status(404).json(utils.apiError("Diskusi tidak ditemukan"))

            if(checkDiscussion.closed === true) return res.status(403).json(utils.apiError("Diskusi sudah ditutup"))

            let discussionCommentar
            let message = 'Berhasil membuat komentar berdasarkan diskusi '

            if( roleName === 'user' ){
                discussionCommentar = await db.discussionCommentar.create({
                    data: {
                       commentar: commentar,
                       discussionId: parseInt(discussionId),
                       userId: parseInt(userId),
                       urlPhoto: uploadFileUrl,
                       imageFilename: uploadFileName
                    }
                })

                message += `menggunakan akun 'user'`
            }

            if (roleName === 'instructor') {
                discussionCommentar = await db.discussionCommentar.create({
                    data: {
                       commentar: commentar,
                       discussionId: parseInt(discussionId),
                       instructorId: parseInt(userId),
                       urlPhoto: uploadFileUrl,
                       imageFilename: uploadFileName
                    }
                })

                message += `menggunakan akun 'instructor'`
            }


            return res.status(201).json(utils.apiSuccess(message, discussionCommentar))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    getCommentarById: async (req, res) => {
        try {

            const commentarId = req.params.id

            const commentar = await db.discussionCommentar.findFirst({
                where: {
                    id: parseInt(commentarId)
                }
            })

            return res.status(200).json(utils.apiSuccess(commentar))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    updateCommentarByIdCourse: async (req, res) => {
        try {
            const id = parseInt(req.params.id)

            const commentars = await db.discussionCommentar.findFirst({
                where: {
                    id: id,
                },
            })

            if (!commentars) return res.status(404).json(utils.apiError("Kategori Tidak di temukan"))

            const photoCommentar = req.file

            const allowedMimes = ['image/png','image/jpeg','image/jpg','image/webp']

            const allowedSizeMb = 2

            let imageUrl = null
            let imageFileName = null

            if (typeof photoCommentar === 'undefined') {

                imageUrl = commentars.urlPhoto
                imageFileName = commentars.imageFilename

            } else {
                if(!allowedMimes.includes(photoCommentar.mimetype)) return res.status(409).json(utils.apiError("Format gambar tidak diperbolehkan"))
                if((photoCommentar.size / (1024*1024)) > allowedSizeMb) return res.status(409).json(utils.apiError("Gambar tidak boleh lebih dari 2mb"))
                if(checkCategory.imageFileName != null) {
                    const deleteFile = await imageKitFile.delete(checkCategory.imageFileName)
                    if(!deleteFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
                }

                const uploadFile = await imageKitFile.upload(photoCommentar)

                if(!uploadFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

                imageUrl = uploadFile.url
                imageFileName = uploadFile.name
            }

            const { commentar, discussionId } = req.body
          
            let message = 'Berhasil update komentar berdasarkan diskusi '
           
                const discussionCommentar = await db.discussionCommentar.update({
                    where: {
                        id: commentars.id
                    },
                    data: {
                        commentar: commentar,
                        discussionId: parseInt(discussionId),
                        urlPhoto: imageUrl,
                        imageFilename: imageFileName
                    }
                })

            return res.status(201).json(utils.apiSuccess(message, discussionCommentar))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    deleteCommentarById: async (req, res) => {
        try {

            const commentarId = req.params.id

            await db.discussionCommentar.delete({
                where: {
                    id: parseInt(commentarId)
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil menghapus commentar"))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },
}