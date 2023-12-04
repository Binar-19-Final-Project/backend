const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')


module.exports = {
    getAll: async (req, res) => {
        try {
            
            const level = await db.courseLevel.findMany()

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data level", level))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },
    getById: async(req, res)=>{
        try {
            const id = parseInt(req.params.id)
            console.log(req.params);
            const level = await db.courseLevel.findUnique({
                where : {
                    id : id
                }
            })
            if(!level){
                return res.status(404).json(utils.apiError("Level Tidak di temukan "))
            }
            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data level berdasarkan id", level))
        } catch (error) {
            console.log(error)
             return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },
    create: async (req, res) => {
        try {

            const {name} = req.body
            const nameSlug = await utils.createSlug(name)

            const level = await db.courseLevel.create({
                data:{
                    name : name,
                    slug : nameSlug,
                }
            })

            

            return res.status(200).json(utils.apiSuccess("Berhasil buat level", level))

        } catch (error) {
            console.log(error)
             return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },
    update: async (req, res) => {
        try {

            const {name} = req.body
            const id = parseInt(req.params.id)
            const nameSlug = await utils.createSlug(name)
            const check = await db.courseLevel.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.apiError("Level Tidak di temukan "))

            const level = await db.courseLevel.update({
                where:{
                    id: id
                },
                data:{
                    name : name,
                    slug : nameSlug
                }
            })

            return res.status(200).json(utils.apiSuccess("Success update level", level))

        } catch (error) {
            console.log(error)
             return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },
    delete: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const check = await db.courseLevel.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.apiError("Level Tidak di temukan"))

            await db.courseLevel.delete({
                where: {
                    id: id
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil Hapus Level"))            

        } catch (error) {
            console.log(error)
             return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

  
}