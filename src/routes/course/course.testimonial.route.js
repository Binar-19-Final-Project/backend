const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/course'),
    checkRole = require('../../middlewares/check.role'),
    { courseTestimonialMiddleware } = require('../../middlewares/course.middleware'),
    router = express.Router()

router.post('/:courseId', verifyToken, courseTestimonialMiddleware, checkRole('user'), validate(schema.testimonial), controller.courseTestimonial.createTestimonial)
router.get('/:courseId',  controller.courseTestimonial.readTestimonialByCourseId)
router.put('/:testimonialId/courses/:courseId', verifyToken, courseTestimonialMiddleware, checkRole('user'), validate(schema.testimonial), controller.courseTestimonial.updateTestimonial)

module.exports = router