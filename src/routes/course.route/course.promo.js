const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.coursePromo.getAll)
router.post('/', validate(schema.promo), controller.coursePromo.create)
router.get('/:id', controller.coursePromo.getById)
router.put('/:id', validate(schema.promo), controller.coursePromo.update)
router.delete('/:id', controller.coursePromo.delete)

module.exports = router