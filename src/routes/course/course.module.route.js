const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.post('/', verifyToken, checkRole('admin'), validate(schema.module), controller.courseModule.createCourseModule)
router.put('/:id', verifyToken, checkRole('admin'), validate(schema.module), controller.courseModule.updateCourseModule)
router.delete('/:id', verifyToken, checkRole('admin'), controller.courseModule.deleteCourseModule)

router.put('/:moduleId/publish', verifyToken, checkRole('admin'), controller.courseModule.unpublishCourse)
    
module.exports = router