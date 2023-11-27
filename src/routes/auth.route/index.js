const express = require("express"),
    authRoute = require('./auth'),
    router = express.Router()
    
router.use('/auth', authRoute)

module.exports = router
