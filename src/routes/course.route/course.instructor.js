const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.instructor.read)
router.post('/', validate(schema.instructor), controller.instructor.create)
router.get('/:id', controller.instructor.readById)
router.put('/:id', validate(schema.instructor), controller.instructor.update)
router.delete('/:id', controller.instructor.delete)

module.exports = router
