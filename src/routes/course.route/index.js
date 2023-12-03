const express = require("express"),
    instructorRoute = require('./course.instructor'),
    courseRoute = require('./course'),
    promoRoute = require('./course.promo'),
    moduleRoute = require('./course.module'),
    contentRoute = require('./course.content'),
    typeRoute = require("./course.type"),
    categoryRoute = require("./course.category"),
    router = express.Router()

router.use('/instructors', instructorRoute)
router.use('/promos', promoRoute)
router.use('/contents', contentRoute)
router.use('/types', typeRoute)
router.use('/categories', categoryRoute)
router.use('/modules', moduleRoute)
router.use('/', courseRoute)

module.exports = router
