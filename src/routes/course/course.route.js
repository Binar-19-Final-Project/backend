const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    multer = require('multer')(),
    checkRole = require('../../middlewares/check.role'),
    { courseContentMiddleware } = require('../../middlewares/course.middleware'),
    controller = require('../../controllers/course'),
    router = express.Router()

router.get('/', controller.course.getCourses)
router.get('/:id', controller.course.getCourseById)
router.post('/', multer.single('courseImage'), validate(schema.course), verifyToken, checkRole('admin'), controller.course.createCourse)
 
router.get('/:courseId/modules', controller.courseModule.getAllCourseModuleByCourseId)
router.get('/:courseId/modules/:moduleId', controller.courseModule.getCourseModuleByIdAndCourseId)

router.get('/:courseId/modules/:moduleId/contents/:contentId', verifyToken, courseContentMiddleware, controller.courseContent.getCourseContentByIdModuleAndCourse)

router.put('/:courseId', verifyToken, checkRole('admin'), multer.single('courseImage'), validate(schema.course), controller.course.updateCourse)

module.exports = router
