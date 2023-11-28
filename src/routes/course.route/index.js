const express = require("express"),
    instructorRoute = require('./course.instructor'),
    courseRoute = require('./course'),
    promoRoute = require('./course.promo'),
    router = express.Router()
    
router.use('/course', courseRoute)
router.use('/course-instructor', instructorRoute)
router.use('/course-promo', promoRoute)

module.exports = router
