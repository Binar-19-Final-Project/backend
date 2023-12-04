const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.post('/', [validate(schema.module), verifyToken, checkRole('admin')], controller.courseModule.createCourseModule)
router.put('/:id', [validate(schema.module), verifyToken, checkRole('admin')], controller.courseModule.updateCourseModule)
router.delete('/:id', [verifyToken, checkRole('admin')], controller.courseModule.deleteCourseModule)
    
module.exports = router