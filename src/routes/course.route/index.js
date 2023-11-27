const express = require("express"),
    instructorRoute = require('./course.instructor'),
    promoRoute = require('./course.promo'),
    router = express.Router()
    
router.use('/course-instructor', instructorRoute)
router.use('/course-promo', promoRoute)

module.exports = router
