const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    { premiumContent } = require('../../middlewares/premium.content'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.course.getCourses)
router.get('/:id', controller.course.getCourseById)

router.get('/:courseId/modules', controller.courseModule.getAllCourseModuleByCourseId)
router.get('/:courseId/modules/:moduleId', controller.courseModule.getCourseModuleByIdAndCourseId)

module.exports = router
