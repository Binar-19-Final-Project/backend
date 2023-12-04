const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/order'),
    router = express.Router()

router.get('/', verifyToken, controller.order.getOrderHistoryById)

module.exports = router