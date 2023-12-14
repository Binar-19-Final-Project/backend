const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/course'),
    checkRole = require('../../middlewares/check.role'),
    /* { courseTestiMiddleware } = require('../../middlewares/course.middleware'), */
    router = express.Router()

router.post('/:courseId',  verifyToken, /* courseTestiMiddleware, */ checkRole('user'), controller.courseTestimonial.createTestimonial)
router.get('/:courseId',  controller.courseTestimonial.readTestimonialByCourseId)

module.exports = router