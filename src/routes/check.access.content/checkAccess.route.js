const express = require('express'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/check.access.content/check.controller'),
    router = express.Router()

router.get('/courses/:courseId/modules/:moduleId/contents/:contentId', verifyToken, controller.checkAccess)

module.exports = router
