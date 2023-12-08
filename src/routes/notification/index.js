const express = require("express"),
    notificationRoute = require('./notification.route'),
    router = express.Router()
    
router.use(notificationRoute)

module.exports = router
