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
            const id = parseInt(req.params.id)
            const category = await db.courseCategory.findUnique({
                where : {
                    id : id
                }
            })
            if(!category){
                return res.status(404).json(utils.apiError("Kategori tidak di temukan"))
            }
            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data kategori berdasarkan id", category))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    },
    create: async (req, res) => {
        try {

            const {name, isPublished} = req.body

            const nameSlug = await utils.createSlug(name)

            const data = await db.courseCategory.create({
                data:{
                    name : name,
                    slug : nameSlug,
                    isPublished : isPublished
                }
            })

<<<<<<< HEAD
            

            return res.status(200).json(utils.apiSuccess("Berhasil Menambah Kategori", data))
=======
            return res.status(200).json(utils.apiSuccess("Berhasil buat Kategori", data))
>>>>>>> db01c4a7ead19ce02d542af2e9a7567e5209b100

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },
    update: async (req, res) => {
        try {

            const {name, isPublished} = req.body
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
                    isPublished : isPublished
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