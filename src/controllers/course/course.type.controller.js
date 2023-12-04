const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')


module.exports = {
    getAll: async (req, res) => {
        try {
            
            const type = await db.couseType.findMany({
                select : {
                    id: true,
                    name : true,
                    slug : true
                }
            })

            return res.status(200).json(utils.apiSuccess("Success fetch data catagory", type))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Internal Server Error"))
        }
    },
    getById: async(req, res)=>{
        try {
            const {id} = req.params
            const type = await db.couseType.findUnique({
                where : {
                    id : parseInt(id)
                },
                select : {
                    id: true,
                    name : true,
                    slug : true
                }
            })
            if(!type){
                return res.status(404).json(utils.error("type not found"))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Internal Server Error"))
        }
    },
    create: async (req, res) => {
        try {

            const {name} = req.body

            const nameSlug = await utils.createSlug(name)

            const data = await db.couseType.create({
                data:{
                    name : name,
                    slug : nameSlug,
                }
            })

            

            return res.status(200).json(utils.apiSuccess("Berhasil buat type", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Internal Server Error"))
        }
    },
    update: async (req, res) => {
        try {

            const {name} = req.body
            const nameSlug = await utils.createSlug(name)
            const id = parseInt(req.params.id)

            const check = await db.couseType.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.error("type not found"))

            const type = await db.couseType.update({
                where:{
                    id: id
                },
                data:{
                    name : name,
                    slug : nameSlug,
                }
            })

            return res.status(200).json(utils.apiSuccess("Success update type", type))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Internal Server Error"))
        }
    },
    delete: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const check = await db.couseType.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.error("type not found"))

            await db.couseType.delete({
                where: {
                    id: id
                }
            })

            return res.status(200).json(utils.apiSuccess("Success delete type"))            

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Internal Server Error"))
        }
    },

  
}