const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    controller = require('../../controllers/auth'),
    router = express.Router()

router.post('/register',  validate(schema.register), controller.auth.register)
router.post('/login',  validate(schema.login), controller.auth.login)
router.post('/verify-user',  validate(schema.verifyUser), controller.auth.verifyUser)
router.post('/request-reset-password',  validate(schema.requestResetPassword), controller.auth.requestResetPassword)
router.post('/reset-password',  validate(schema.resetPassword), controller.auth.resetPassword)
router.post('/resend-otp',  validate(schema.resendOtp), controller.auth.resendOtp)
router.post('/change-password', [verifyToken, validate(schema.changePassword), checkRole('user')], controller.auth.changePassword)

/* Google Auth */
router.get("/google", controller.auth.googleLogin);
router.get("/google/callback", controller.auth.googleCallbackLogin);

module.exports = router
