const express = require("express"),
    instructorRoute = require('./course.instructor.route'),
    courseRoute = require('./course.route'),
    promoRoute = require('./course.promo.route'),
    moduleRoute = require('./course.module.route'),
    contentRoute = require('./course.content.route'),
    typeRoute = require("./course.type.route"),
    categoryRoute = require("./course.category.route"),
    router = express.Router()

router.use('/courses', courseRoute)
router.use('/course-modules', moduleRoute)
router.use('/course-contents', contentRoute)
router.use('/course-instructors', instructorRoute)
router.use('/course-categories', categoryRoute)
router.use('/course-promos', promoRoute)
router.use('/course-types', typeRoute)


module.exports = router
