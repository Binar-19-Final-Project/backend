const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.courseModule.getAll)
router.post('/', validate(schema.module), controller.courseModule.create)
router.get('/:id', controller.courseModule.getById)
router.put('/:id', validate(schema.module), controller.courseModule.update)
router.delete('/:id', controller.courseModule.delete)

module.exports = router