const express = require("express"),
    authRoute = require('./auth'),
    router = express.Router()
    
router.use(authRoute)

module.exports = router
