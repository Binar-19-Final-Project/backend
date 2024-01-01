const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    multer = require('multer')(),
    router = express.Router()

router.get('/:id', controller.courseInstructor.readById)
router.get('/', controller.courseInstructor.read)
router.put('/:id', verifyToken, multer.single('photoInstructor'),  validate(schema.registerInstructor), checkRole('admin'), controller.courseInstructor.update)
router.delete('/:id', verifyToken, checkRole('admin'), controller.courseInstructor.delete)

module.exports = router
