const express = require("express"),
    orderRoute = require('./order.route'),
    router = express.Router()
    
router.use('/orders', orderRoute)

module.exports = router
