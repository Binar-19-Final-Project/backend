const express = require("express"),
    authRoute = require('./auth.route'),
    router = express.Router()
    
router.use(authRoute)

module.exports = router
