const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.courseLevel.getAll)
router.post('/', validate(schema.level), controller.courseLevel.create)
router.get('/:id', controller.courseLevel.getById)
router.put('/:id', validate(schema.level), controller.courseLevel.update)
router.delete('/:id', controller.courseLevel.delete)

module.exports = router