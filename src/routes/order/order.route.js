const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/order'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.get('/', verifyToken, checkRole('user'), controller.order.getOrderHistoryById)
router.get('/all', verifyToken, checkRole('admin'), controller.order.getOrders)
router.post('/:courseId', verifyToken, checkRole('user'), controller.order.createOrder)
router.put('/confirm/:id', verifyToken, checkRole('admin'), controller.order.confirmOrderPremium)

module.exports = router
