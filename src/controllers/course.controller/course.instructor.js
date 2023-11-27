const db = require('../../../prisma/connection')
const responseApi = require('../../utils/responseApi')

module.exports = {
    read: async (req, res) => {
        try {
            const data = await db.courseInstructor.findMany({
                select: {
                    id: true,
                    name: true
                }
            })
            return res.status(200).json(responseApi.success("Success fetch data instructor", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error("Internal Server Error"))
        }
    },

    readById: async (req, res) => {
        const { id } = req.params
        try {
            const instructor = await db.courseInstructor.findUnique({
                where: { 
                    id: parseInt(id)
                },
                select: {
                    id: true,
                    name: true
                }
            })
            if (!instructor) {
                return res.status(404).json(responseApi.error("Instructor not found"))
            }
            return res.status(200).json(responseApi.success("Success fetch instructor by id", instructor))
        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error("Internal Server Error"))
        }
    },

    create: async (req, res) => {
        try {
            const { name } = req.body

            const instructor = await db.courseInstructor.create({
                data: {
                    name: name 
                }
            })

            return res.status(201).json(responseApi.success("Success create instructor", instructor))
        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error("Internal Server Error"))
        }
    },

    update: async (req, res) => {
        const { id } = req.params
        const { name } = req.body

        try {
            const updatedInstructor = await db.courseInstructor.update({
                where: {
                    id: parseInt(id) 
                },
                data: { 
                    name: name
                }
            })

            return res.status(200).json(responseApi.success("Success update instructor", updatedInstructor))
        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error("Internal Server Error"))
        }
    },

    delete: async (req, res) => {
        const { id } = req.params
        try {
            await db.courseInstructor.delete({
                where: {
                    id: parseInt(id) 
                }
            })
            return res.status(200).json(responseApi.success("Success delete instructor"))
        } catch (error) {
            console.log(error)
            return res.status(500).json(responseApi.error("Internal Server Error"))
        }
    }
}
