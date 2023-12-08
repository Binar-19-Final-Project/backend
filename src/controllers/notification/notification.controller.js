const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils')

module.exports = {

    getNotificationByUserId: async (req, res) => {
        try {

            const notifications = await db.notification.findMany({
                where: {
                    userId: res.user.id
                },
                orderBy: {
                    id: 'desc'
                }
            })

            return res.status(200).json(utils.apiSuccess("Berhasil mendapatkan notifikasi berdasarkan user id", notifications))
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server"))
        }
    },

    updateNotification: async (req, res) => {
        try {

            const {notificationId} = req.body

            const checkNotification = await db.notification.findUnique({
                where: {
                    id: notificationId                
                }
            })

            if(!checkNotification) return res.status(404).json(utils.apiError("Notifikasi tidak ditemukkan"))

            await db.notification.update({
                where:{
                    id: notificationId
                },
                data: {
                    readAt: new Date()
                }
            })

            return res.status(200).json(utils.apiSuccess("Notifikasi berhasil diubah (dibaca)"))
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    },

    deleteNotification: async (req, res) => {
        try {

            const {notificationId} = req.body

            const checkNotification = await db.notification.findUnique({
                where: {
                    id: notificationId
                }
            })

            if(!checkNotification) return res.status(404).json(utils.apiError("Notifikasi tidak ditemukkan"))

            await db.notification.delete({
                where: {
                    id: notificationId
                }
            })

            return res.status(200).json(utils.apiSuccess("Notifikasi berhasil dihapus"))
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada Internal Server "))
        }
    }
}