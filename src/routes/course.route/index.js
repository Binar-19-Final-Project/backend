const express = require("express"),
    instructorRoute = require('./course.instructor'),
    courseRoute = require('./course'),
    router = express.Router()
    
router.use('/course', courseRoute)
router.use('/course-instructor', instructorRoute)

module.exports = router
