const express = require("express"),
    instructorRoute = require('./course.instructor.route'),
    courseRoute = require('./course.route'),
    promoRoute = require('./course.promo.route'),
    moduleRoute = require('./course.module.route'),
    contentRoute = require('./course.content.route'),
    typeRoute = require("./course.type.route"),
    categoryRoute = require("./course.category.route"),
    router = express.Router()

router.use('/', courseRoute)
router.use('/modules', moduleRoute)
router.use('/instructors', instructorRoute)
router.use('/contents', contentRoute)
router.use('/promos', promoRoute)
router.use('/types', typeRoute)
router.use('/categories', categoryRoute)

module.exports = router

/* upadate */