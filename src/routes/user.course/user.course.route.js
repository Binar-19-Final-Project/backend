const express = require('express'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/user.course'),
    router = express.Router()

router.get('/', verifyToken, controller.userCourse.getUserCoursesByIdUser)
router.get('/:userCourseId', verifyToken, controller.userCourse.getUserCoursesByIdUserCourse)

module.exports = router
