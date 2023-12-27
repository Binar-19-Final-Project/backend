const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    controller = require('../../controllers/auth'),
    router = express.Router()

router.post('/instructor/register', verifyToken, checkRole('admin'), controller.authInstructor.register)
router.post('/instructor/login', controller.authInstructor.login)

module.exports = router
