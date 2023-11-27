const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    slugify = require('slugify')


module.exports = {
    getAll: async (req, res) => {
        try {
            
            const type = await db.cousetype.findMany({
                select : {
                    id: true,
                    name : true,
                    slug : true
                }
            })

            return res.status(200).json(utils.success("Success fetch data catagory", type))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Internal Server Error"))
        }
    },
    getById: async(req, res)=>{
        try {
            const {id} = req.params
            const type = await db.cousetype.findUnique({
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

            const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g })

            const data = await db.cousetype.create({
                data:{
                    name : name,
                    slug : slug,
                }
            })

            

            return res.status(200).json(utils.success("Berhasil buat type", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Internal Server Error"))
        }
    },
    update: async (req, res) => {
        try {

            const {name} = req.body
            const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g })
            const id = parseInt(req.params.id)

            const check = await db.cousetype.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.error("type not found"))

            const type = await db.cousetype.update({
                where:{
                    id: id
                },
                data:{
                    name : name,
                    slug : slug,
                }
            })

            return res.status(200).json(utils.success("Success update type", type))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Internal Server Error"))
        }
    },
    destroy: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const check = await db.cousetype.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(utils.error("type not found"))

            await db.cousetype.delete({
                where: {
                    id: id
                }
            })

            return res.status(200).json(utils.success("Success delete type"))            

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.error("Internal Server Error"))
        }
    },

  
}