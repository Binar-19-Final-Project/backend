const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.get('/:id', controller.courseInstructor.readById)

router.get('/', verifyToken, checkRole('admin'), controller.courseInstructor.read)
router.post('/', verifyToken, checkRole('admin'), validate(schema.instructor), controller.courseInstructor.create)
router.put('/:id', verifyToken, checkRole('admin'), validate(schema.instructor), controller.courseInstructor.update)
router.delete('/:id', verifyToken, checkRole('admin'), controller.courseInstructor.delete)

module.exports = router
