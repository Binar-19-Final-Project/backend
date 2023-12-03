const express = require('express'),
    controller = require('../../controllers/course.controller'),
    router = express.Router()

router.get('/type', controller.courseType.getAll)
router.post('/type',  controller.courseType.create)
router.get('/type/:id', controller.courseType.getById)
router.put('/type/:id',  controller.courseType.update)
router.delete('/type/:id', controller.courseType.delete)

module.exports = router