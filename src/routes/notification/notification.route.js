const express = require('express'),
    schema = require('../../validation/notification.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    controller = require('../../controllers/notification'),
    router = express.Router()

router.get('/', verifyToken, checkRole('user'), controller.notification.getNotificationByUserId)
router.put('/', verifyToken, checkRole('user'), validate(schema.notification), controller.notification.updateNotification)
router.delete('/', verifyToken, checkRole('user'), validate(schema.notification), controller.notification.deleteNotification)

module.exports = router