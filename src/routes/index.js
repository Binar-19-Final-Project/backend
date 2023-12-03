const express = require("express"),
    authRoute = require('./auth.route'),
    courseRoute = require('./course.route'),
    router = express.Router()
    
router.use(authRoute)
router.use("/courses", courseRoute)

module.exports = router
