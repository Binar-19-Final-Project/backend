const express = require('express'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/', controller.courseLevel.getAll)
router.post('/',  controller.courseLevel.create)
router.get('/:id', controller.courseLevel.getById)
router.put('/:id',  controller.courseLevel.update)
router.delete('/:id', controller.courseLevel.delete)

module.exports = router