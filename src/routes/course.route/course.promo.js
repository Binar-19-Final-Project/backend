const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/promo', controller.coursePromo.getAll)
router.post('/promo', validate(schema.promo), controller.coursePromo.create)
router.get('/promo/:id', controller.coursePromo.getById)
router.put('/promo/:id', validate(schema.promo), controller.coursePromo.update)
router.delete('/promo/:id', controller.coursePromo.delete)

module.exports = router