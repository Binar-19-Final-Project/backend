const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.promo.getAll)
router.post('/', validate(schema.promo), controller.promo.create)
router.get('/:id', controller.promo.getById)
router.put('/:id', validate(schema.promo), controller.promo.update)
router.delete('/:id', controller.promo.delete)

module.exports = router