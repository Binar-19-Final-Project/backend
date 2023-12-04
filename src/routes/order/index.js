const express = require("express"),
    orderRoute = require('./order.route'),
    router = express.Router()
    
router.use(orderRoute)

module.exports = router
