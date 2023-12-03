const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    { premiumContent } = require('../../middlewares/premium.content'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/content', controller.courseContent.getAll)
router.post('/content', validate(schema.content), controller.courseContent.create)
router.get('/content/:id', controller.courseContent.getById)
router.put('/content/:id', validate(schema.content), controller.courseContent.update)
router.delete('/content/:id', controller.courseContent.delete)

router.get('/:courseId/module/:moduleId/content/:contentId', verifyToken, premiumContent, controller.courseContent.getCourseContentByIdModuleAndCourse)

module.exports = router