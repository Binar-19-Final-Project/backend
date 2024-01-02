const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/order'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.get('/', verifyToken, checkRole('user'), controller.order.getOrderHistoryById)
router.get('/all', verifyToken, checkRole('admin'), controller.order.getOrders)
router.post('/:courseId/free', verifyToken, checkRole('user'), controller.order.enrollFree)
router.post('/:courseId/premium', verifyToken, checkRole('user'), controller.order.orderPremium)
router.put('/confirm/:id', verifyToken, checkRole('admin'), controller.order.confirmOrderPremium)

module.exports = router
