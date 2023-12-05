const express = require("express"),
    checkAccessRoute = require('./checkAccess.route'),
    router = express.Router()
    
    router.use('/check-access', checkAccessRoute)
   
module.exports = router
