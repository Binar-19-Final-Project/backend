const db = require('../../prisma/connection'),
    utils = require('../utils/utils')

const checkRole = (...roles) => {
    return async (req, res, next) => {
        try {

            const userId = res.user.id

            if(roles.includes('admin')) {
                const admin = await db.admin.findUnique({
                    where: {
                        id: userId
                    }
                })
    
                if(!admin) return res.status(404).json(utils.apiError("Admin tidak ditemukkan"))
    
    
                if(!roles.includes(admin.roleName)) return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))
    
                return next()
            }

            if(roles.includes('instructor')) {
                const instructor = await db.courseInstructor.findUnique({
                    where: {
                        id: userId
                    }
                })
    
                if(!instructor) return res.status(404).json(utils.apiError("Instructor tidak ditemukkan"))
    
    
                if(!roles.includes(instructor.roleName)) return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))
    
                return next()
            }

            if(roles.includes('user')) {
                const user = await db.user.findUnique({
                    where: {
                        id: userId
                    }
                })
    
                if(!user) return res.status(404).json(utils.apiError("User tidak ditemukkan"))
    
    
                if(!roles.includes(user.roleName)) return res.status(403).json(utils.apiError("Akses tidak diperbolehkan"))
    
                return next()
            }

            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    }
}

module.exports = checkRole
