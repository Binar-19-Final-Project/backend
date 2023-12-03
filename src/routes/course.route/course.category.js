const express = require('express'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/category', controller.courseCategory.getAll)
router.post('/category',  controller.courseCategory.create)
router.get('/category/:id', controller.courseCategory.getById)
router.put('/category/:id',  controller.courseCategory.update)
router.delete('/category/:id', controller.courseCategory.delete)

module.exports = router