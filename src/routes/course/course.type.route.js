const express = require('express'),
    controller = require('../../controllers/course'),
    router = express.Router()

router.get('/', controller.courseType.getAll)
router.post('/',  controller.courseType.create)
router.get('/:id', controller.courseType.getById)
router.put('/:id',  controller.courseType.update)
router.delete('/:id', controller.courseType.delete)

module.exports = router