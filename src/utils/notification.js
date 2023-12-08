const db = require('../../prisma/connection')

module.exports = { 
    createNotification: async (type, data, msg, userId) => {
        try {

            const checkUser = await db.user.findUnique({
                where: {
                    id: userId
                }
            })

            if(!checkUser) return false

            await db.notification.create({
                data: {
                    type: type,
                    data: data,
                    message: msg,
                    userId: userId
                }
            })

            return true
            
        } catch (error) {
            console.log(error)
            return false
        }
    }
}