const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {
    getAll: async (req, res) => {
        try {
            
            const data = await db.coursePromo.findMany()

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil semua data promo", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
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

            if(check) return res.status(409).json(utils.apiError("Nama promo sudah terdaftar"))
            
            const nameSlug = await utils.createSlug(name)

            const data = await db.coursePromo.create({
                data: {
                    name: name,
                    slug: nameSlug,
                    discount: parseFloat(discount),
                    expiredAt: expiredAt
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil membuat promo", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    getById: async (req, res) => {
        try {

            const id = parseInt(req.params.id)

            const data = await db.coursePromo.findUnique({
                where:{
                    id: id
                },
                include: {
                    course: true
                }
            })

            if(!data) return res.status(404).json(utils.apiError("Promo tidak ditemukkan"))

            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data promo berdasarkan id", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
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

            if(!check) return res.status(404).json(utils.apiError("Promo tidak ditemukkan"))

            const checkName = await db.coursePromo.findFirst({
                where: {
                    name: name,
                    NOT: {
                        id: id
                    }
                },
            })

            if(checkName) return res.status(409).json(utils.apiError("Nama promo sudah terdaftar"))

            const nameSlug = await utils.createSlug(name);

            const data = await db.coursePromo.update({
                where:{
                    id: id
                },
                data: {
                    name: name,
                    slug: nameSlug,
                    discount: parseFloat(discount),
                    expiredAt: expiredAt
                }
            })

            return res.status(200).json(utils.apiSuccess("Promo berhasil diubah", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
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

            if(!check) return res.status(404).json(utils.apiError("Promo tidak ditemukkan"))

            await db.coursePromo.delete({
                where: {
                    id: id
                }
            })

            return res.status(200).json(utils.apiSuccess("Promo berhasil dihapus"))            

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

}
