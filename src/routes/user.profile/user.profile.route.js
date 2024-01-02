const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/auth'),
    multer = require('multer')(),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.get('/', verifyToken, controller.auth.getProfile)
router.put('/', verifyToken, checkRole('user'), validate(schema.updateProfile), controller.auth.updateProfile)
router.put('/images', verifyToken, checkRole('user'), validate(schema.updateProfilePhoto), multer.single('photoProfile'), controller.auth.updateProfilePhoto)

module.exports = router