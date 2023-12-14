const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/order'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.get('/', verifyToken, controller.order.getOrderHistoryById)
router.post('/:courseId', verifyToken, checkRole('user'), controller.order.createOrder)

module.exports = router
