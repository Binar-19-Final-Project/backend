const express = require('express'),
    schema = require('../../validation/auth.schema'),
    validate = require('../../middlewares/validation'),
    controller = require('../../controllers/auth.controller'),
    router = express.Router()

router.post('/register',  validate(schema.register), controller.auth.register)

module.exports = router
