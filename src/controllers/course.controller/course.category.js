const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')


module.exports = {
    getAll: async (req, res) => {
        try {
            
            const category = await db.courseCategory.findMany()

            return res.status(200).json(utils.apiSuccess("Berhasil Menampilkan Semua Data Kategori", category))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },
    getById: async(req, res)=>{
        try {
            const {id} = req.params
            const category = await db.courseCategory.findUnique({
                where : {
                    id : parseInt(id)
                },
                select : {
                    id: true,
                    name : true,
                    is_published : true,
                    slug : true
                }
            })
            if(!category){
                return res.status(404).json(utils.apiError("Kategori tidak di temukan"))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    },
    create: async (req, res) => {
        try {

            const {name} = req.body

            const nameSlug = await utils.createSlug(name)

            const data = await db.courseCategory.create({
                data:{
                    name : name,
                    slug : nameSlug,
                    is_published : false
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil buat Kategori", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },
    update: async (req, res) => {
        try {

            const {name} = req.body
            const nameSlug = await utils.createSlug(name)
            const id = parseInt(req.params.id)

            const check = await db.courseCategory.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.apiError("Kategori Tidak di temukan"))

            const category = await db.courseCategory.update({
                where:{
                    id: id
                },
                data:{
                    name : name,
                    slug : nameSlug,
                    is_published : false
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil mengubah kategori", category))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },
    delete: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const check = await db.courseCategory.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.apiError("Kategori tidak di temukan"))

            await db.courseCategory.delete({
                where: {
                    id: id
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil menghapus kategori"))            

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

  
}