const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {
    getAll: async(req, res)=>{
        try {
            const whistList = await db.UserCourseWishlist.findMany();

            return res.status(200).json(utils.apiSuccess("Berhasil menampilkan semua data Whistlist", whistList))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan dalam server"))
        }
    },
    getById: async(req, res)=>{
        const id = parseInt(req.params.id)

        const whistList = await db.userCourseWishlist.findUnique({
            where:{
                id: id
            }
        })
        if(!whistList){
            return res.status(404).json(utils.apiError("Level Tidak di temukan "))
        }
        return res.status(200).json(utils.apiSuccess("Berhasil menampilkan satu data Whistlist", whistList))
    }
}