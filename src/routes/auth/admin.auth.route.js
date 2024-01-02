const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    controller = require('../../controllers/auth'),
    router = express.Router()

router.post('/admin/register', controller.authAdmin.register)
router.post('/admin/login', controller.authAdmin.login)

module.exports = router
