const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.get('/', controller.coursePromo.getAll)
router.get('/:id', controller.coursePromo.getById)

router.post('/', verifyToken, checkRole('admin'), validate(schema.promo), controller.coursePromo.create)
router.put('/:id', verifyToken, checkRole('admin'), validate(schema.promo), controller.coursePromo.update)
router.delete('/:id', verifyToken, checkRole('admin'), controller.coursePromo.delete)

module.exports = router