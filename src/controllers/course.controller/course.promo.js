const db = require('../../../prisma/connection')
const responseApi = require('../../utils/responseApi')

module.exports = {
    getAll: async (req, res) => {
        try {
            
            const data = await db.coursePromo.findMany()

            return res.status(200).json(responseApi.success("Success fetch data promo", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error("Internal Server Error"))
        }
    },

    create: async (req, res) => {
        try {

            const {name, discount, expiredAt} = req.body

            const check = await db.coursePromo.findFirst({
                where:{
                    name: name
                }
            })

            if(check) return res.status(400).json(responseApi.error("Name already taken"))
            
            const data = await db.coursePromo.create({
                data: {
                    name: name,
                    discount: parseFloat(discount),
                    expiredAt: expiredAt
                }
            })

            return res.status(200).json(responseApi.success("Success create promo", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error("Internal Server Error"))
        }
    },

    getById: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const data = await db.coursePromo.findUnique({
                where:{
                    id: id
                }
            })

            if(!data) return res.status(404).json(responseApi.error("Promo not found"))

            return res.status(200).json(responseApi.success("Success fetch promo by id", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error("Internal Server Error"))
        }
    },

    update: async (req, res) => {
        try {

            const {name, discount, expiredAt} = req.body
            const id = parseInt(req.params.id)

            const check = await db.coursePromo.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(responseApi.error("Promo not found"))

            const data = await db.coursePromo.update({
                where:{
                    id: id
                },
                data: {
                    name: name,
                    discount: parseFloat(discount),
                    expiredAt: expiredAt
                }
            })

            return res.status(200).json(responseApi.success("Success update promo", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error("Internal Server Error"))
        }
    },

    delete: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const check = await db.coursePromo.findUnique({
                where:{
                    id: id
                }
            })

            if(!check) return res.status(404).json(responseApi.error("Promo not found"))

            await db.coursePromo.delete({
                where: {
                    id: id
                }
            })

            return res.status(200).json(responseApi.success("Success delete promo"))            

        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error("Internal Server Error"))
        }
    },

  
}
