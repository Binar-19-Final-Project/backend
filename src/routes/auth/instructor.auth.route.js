const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    controller = require('../../controllers/auth'),
    multer = require('multer')(),
    router = express.Router()

router.post('/instructor/register', verifyToken, multer.single('photoInstructor'),  validate(schema.registerInstructor), checkRole('admin'), controller.authInstructor.register)
/* router.post('/instructor/register', verifyToken, multer.single('photoInstructor'),  validate(schema.registerInstructor), checkRole('admin'), controller.authInstructor.register) */
router.post('/instructor/login', controller.authInstructor.login)
router.post('/instructor/change-password', verifyToken, checkRole('instructor'), validate(schema.changePassword), controller.authInstructor.changePassword)

module.exports = router
