const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')


module.exports = {
    getAll: async (req, res) => {
        try {
            
            const type = await db.courseType.findMany()

            return res.status(200).json(utils.apiSuccess("Berhasil menampilkan semua data tipe", type))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Kesalahan dalam server"))
        }
    },
    getById: async(req, res)=>{
        try {
            const id = parseInt(req.params.id)
            const type = await db.courseType.findUnique({
                where : {
                    id : id
                }
            })
            if(!type) return res.status(404).json(utils.apiError("Tipe tidak ditemukkan"))
            
            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data Tipe berdasarkan id", type))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Kesalahan dalam server"))
        }
    },
    create: async (req, res) => {
        try {

            const {name} = req.body

            const nameSlug = await utils.createSlug(name)

            const data = await db.courseType.create({
                data:{
                    name : name,
                    slug : nameSlug,
                }
            })

            

            return res.status(200).json(utils.apiSuccess("Berhasil membuat tipe", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Kesalahan dalam server"))
        }
    },
    update: async (req, res) => {
        try {

            const {name} = req.body
            const nameSlug = await utils.createSlug(name)
            const id = parseInt(req.params.id)

            const check = await db.courseType.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.error("tipe tidak di temukan"))

            const type = await db.courseType.update({
                where:{
                    id: id
                },
                data:{
                    name : name,
                    slug : nameSlug,
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil mengubah tipe", type))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Kesalahan dalam server"))
        }
    },
    delete: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const check = await db.courseType.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.error("Tipe tidak di temukan"))

            await db.courseType.delete({
                where: {
                    id: id
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil menghapus tipe"))            

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Kesalahan dalam server"))
        }
    },

  
}