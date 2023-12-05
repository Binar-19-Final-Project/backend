const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/user.course'),
    router = express.Router()

router.get('/', verifyToken, controller.userCourse.getUserCoursesById)

module.exports = router
