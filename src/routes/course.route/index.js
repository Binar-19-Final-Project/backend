const express = require("express"),
    instructorRoute = require('./course.instructor'),
    courseRoute = require('./course'),
    promoRoute = require('./course.promo'),
    moduleRoute = require('./course.module'),
    contentRoute = require('./course.content'),
    typeRoute = require("./course.type"),
    categoryRoute = require("./course.category")
    router = express.Router()
    
router.use('/course', courseRoute)
router.use('/course-instructor', instructorRoute)
router.use('/course-promo', promoRoute)
router.use('/course-module', moduleRoute)
router.use('/course-content', contentRoute)
router.use('/course-type', typeRoute)
router.use("/course-category", categoryRoute)

module.exports = router
