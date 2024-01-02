const db = require('../../prisma/connection'),
    utils = require('../utils/utils')

const checkRole = (...roles) => {
    return async (req, res, next) => {
        try {

            const roleName = res.user.roleName

            if ( roles.includes(roleName) ) {
                return next()
            } else {
                return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    }
}


module.exports = checkRole
