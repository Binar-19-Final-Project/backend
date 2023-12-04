const express = require("express"),
    userCourseRoutes = require('./user.courses.route'),
    router = express.Router()
    
router.use(userCourseRoutes)

module.exports = router
