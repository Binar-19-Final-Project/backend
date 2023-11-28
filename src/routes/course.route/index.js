const express = require("express"),
    instructorRoute = require('./course.instructor'),
    courseRoute = require('./course'),
    promoRoute = require('./course.promo'),
    moduleRoute = require('./course.module'),
    typeRoute = require("./course.type")
    router = express.Router()
    
router.use('/course', courseRoute)
router.use('/course-instructor', instructorRoute)
router.use('/course-promo', promoRoute)
router.use('/course-module', moduleRoute)
router.use('/course-type', typeRoute)


module.exports = router
