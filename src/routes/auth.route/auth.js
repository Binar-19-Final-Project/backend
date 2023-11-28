const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    controller = require('../../controllers/auth.controller'),
    router = express.Router()

router.post('/register',  validate(schema.register), controller.auth.register)
router.post('/login',  validate(schema.login), controller.auth.login)
router.post('/verify-user',  validate(schema.verifyUser), controller.auth.verifyUser)
router.post('/request-reset-password',  validate(schema.requestResetPassword), controller.auth.requestResetPassword)
router.post('/reset-password',  validate(schema.resetPassword), controller.auth.resetPassword)
router.get('/profile', verifyToken, controller.auth.profile)

module.exports = router
