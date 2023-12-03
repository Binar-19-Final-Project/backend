const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/instructor', controller.courseInstructor.read)
router.post('/instructor', validate(schema.instructor), controller.courseInstructor.create)
router.get('/instructor/:id', controller.courseInstructor.readById)
router.put('/instructor/:id', validate(schema.instructor), controller.courseInstructor.update)
router.delete('/instructor/:id', controller.courseInstructor.delete)

module.exports = router
