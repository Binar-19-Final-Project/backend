const express = require("express"),
    courseRoute = require('./course.route'),
    router = express.Router()
    
router.use(courseRoute)

module.exports = router
