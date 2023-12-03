const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/module', controller.courseModule.getAll)
router.post('/module', validate(schema.module), controller.courseModule.create)
router.get('/module/:id', controller.courseModule.getById)
router.put('/module/:id', validate(schema.module), controller.courseModule.update)
router.delete('/module/:id', controller.courseModule.delete)

router.get('/:courseId/module', controller.courseModule.getAllCourseModuleByIdCourse)
router.get('/:courseId/module/:moduleId', controller.courseModule.getCourseModuleByIdAndCourseId)

module.exports = router