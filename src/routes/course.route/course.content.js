const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.courseContent.getAll)
router.post('/', validate(schema.content), controller.courseContent.create)
router.get('/:id', controller.courseContent.getById)
router.put('/:id', validate(schema.content), controller.courseContent.update)
router.delete('/:id', controller.courseContent.delete)

router.get('/:courseId/module/:moduleId/content/:contentId', controller.courseContent.getCourseContentByIdModuleAndCourse)

module.exports = router