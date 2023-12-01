const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.content.getAll)
router.post('/', validate(schema.content), controller.content.create)
router.get('/:id', controller.content.getById)
router.put('/:id', validate(schema.content), controller.content.update)
router.delete('/:id', controller.content.delete)

module.exports = router