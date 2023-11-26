const express = require("express"),
    instructorRoute = require('./course.instructor'),
    router = express.Router()
    
router.use('/course-instructor', instructorRoute)

module.exports = router
