const express = require("express"),
    authRoute = require('./auth'),
    courseRoute = require('./course'),
    orderRoute = require('./order'),
    router = express.Router()
    
router.use("/auth", authRoute)
router.use("/courses", courseRoute)
router.use("/orders", orderRoute)

module.exports = router
