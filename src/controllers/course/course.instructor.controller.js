const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    slugify = require('slugify')

module.exports = {
    read: async (req, res) => {
        try {
            const data = await db.courseInstructor.findMany()
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
