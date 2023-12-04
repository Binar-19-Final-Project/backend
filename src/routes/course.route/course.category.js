const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.courseCategory.getAll)
router.post('/',  controller.courseCategory.create)
router.get('/:id', controller.courseCategory.getById)
router.put('/:id',  controller.courseCategory.update)
router.delete('/:id', controller.courseCategory.delete)

module.exports = router