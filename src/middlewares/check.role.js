const db = require('../../prisma/connection'),
    utils = require('../utils/utils')

const checkRole = (...roles) => {
    return async (req, res, next) => {
        try {

            const userId = res.user.id

            const user = await db.user.findUnique({
                where: {
                    id: userId
                }
            })

            if(!user) return res.status(404).json(utils.apiError("User tidak ditemukkan"))


            if(!roles.includes(user.roleName)) return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))

            return next()
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    }
}

module.exports = checkRole
