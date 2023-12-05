const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course'),
    router = express.Router()

router.get('/', controller.courseInstructor.read)
router.post('/', validate(schema.instructor), controller.courseInstructor.create)
router.get('/:id', controller.courseInstructor.readById)
router.put('/:id', validate(schema.instructor), controller.courseInstructor.update)
router.delete('/:id', controller.courseInstructor.delete)

module.exports = router
