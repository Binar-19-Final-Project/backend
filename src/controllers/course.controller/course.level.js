const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')


module.exports = {
    getAll: async (req, res) => {
        try {
            
            const type = await db.courseLevel.findMany()

            return res.status(200).json(utils.apiSuccess("Success fetch data catagory", type))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Kesalahan pada server"))
        }
    },
    getById: async(req, res)=>{
        try {
            const {id} = req.params
            const type = await db.courseLevel.findUnique({
                where : {
                    id : parseInt(id)
                }
            })
            if(!type){
                return res.status(404).json(utils.error("Level Tidak di temukan "))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Kesalahan pada server"))
        }
    },
    create: async (req, res) => {
        try {

            const {name} = req.body

            const data = await db.courseLevel.create({
                data:{
                    name : name,
                   
                }
            })

            

            return res.status(200).json(utils.apiSuccess("Berhasil buat type", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Kesalahan pada server"))
        }
    },
    update: async (req, res) => {
        try {

            const {name} = req.body
            const id = parseInt(req.params.id)

            const check = await db.courseLevel.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.error("Level Tidak di temukan "))

            const type = await db.courseLevel.update({
                where:{
                    id: id
                },
                data:{
                    name : name
                }
            })

            return res.status(200).json(utils.apiSuccess("Success update type", type))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Kesalahan pada server"))
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

            if(!check) return res.status(404).json(utils.error("Level Tidak di temukan"))

            await db.courseLevel.delete({
                where: {
                    id: id
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil Hapus Level"))            

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Kesalahan pada server"))
        }
    },

  
}