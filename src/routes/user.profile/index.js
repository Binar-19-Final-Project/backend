const express = require("express"),
    userProfileRoute = require('./user.profile.route'),
    router = express.Router()
    
router.use(userProfileRoute)

module.exports = router
