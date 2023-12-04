const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.courseUserWhislist.getAll)
// router.post('/', validate(schema.type), controller.courseType.create)
// router.get('/:id', controller.courseType.getById)
// router.put('/:id', validate(schema.type), controller.courseType.update)
// router.delete('/:id', controller.courseType.delete)

module.exports = router