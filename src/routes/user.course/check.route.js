const express = require('express'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/user.course/check.controller'),
    router = express.Router()

router.get('/check/courses/:courseId', verifyToken, controller.checkUserCourse)
router.get('/check-access/courses/:courseId/modules/:moduleId/contents/:contentId', verifyToken, controller.checkAccess)

module.exports = router
