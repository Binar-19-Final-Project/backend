const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    slugify = require('slugify')

module.exports = {
    read: async (req, res) => {
        try {
            const data = await db.courseInstructor.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            })
            return res.status(200).json(utils.apiSuccess("Berhasil mengambil semua data instructor", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
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
                    name: true,
                    slug: true
                }
            })
            if (!instructor) {
                return res.status(404).json(utils.apiError("Instructor not found"))
            }
            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data instructor berdasarkan id", instructor))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    create: async (req, res) => {
        try {
            const { name } = req.body
            const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g })
            const instructor = await db.courseInstructor.create({
                data: {
                    name: name,
                    slug: slug
                }
            })

            return res.status(201).json(utils.apiSuccess("Berhasil membuat data instructor", instructor))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    update: async (req, res) => {
        const { id } = req.params
        const { name } = req.body
        const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g })
        try {
            const updatedInstructor = await db.courseInstructor.update({
                where: {
                    id: parseInt(id) 
                },
                data: { 
                    name: name,
                    slug: slug
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil update data instructor", updatedInstructor))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
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
            return res.status(200).json(utils.apiSuccess("Berhasil hapus data Instructor"))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}
