const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/course'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.post('/:courseId',  verifyToken, checkRole('user'), controller.courseTestimonial.createTestimonial)
router.get('/:courseId',  controller.courseTestimonial.readTestimonialByCourseId)

module.exports = router