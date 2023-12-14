const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/course'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.post('/', verifyToken, checkRole('admin'), validate(schema.content), controller.courseContent.createCourseContent)
router.put('/:id', verifyToken, checkRole('admin'), validate(schema.content), controller.courseContent.updateCourseContent)
router.delete('/:id', verifyToken, checkRole('admin'), controller.courseContent.deleteCourseContent)

module.exports = router