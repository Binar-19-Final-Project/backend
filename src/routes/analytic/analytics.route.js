const express = require('express'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    controller = require('../../controllers/analytics'),
    router = express.Router()

router.get("/courses", controller.courseAnalytics.getCourse)
router.get("/courses/precentage", controller.courseAnalytics.getCoursePrecentage)

module.exports = router
