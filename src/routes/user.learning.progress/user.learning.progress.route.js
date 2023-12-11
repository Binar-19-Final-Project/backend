const express = require('express'),
    controller = require('../../controllers/user.learning.progress'),
    {verifyToken} = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

// router.post('/', verifyToken, checkRole('user'), controller.userLearningProgress.createLearningProgress)
router.put('/', verifyToken, checkRole('user'), controller.userLearningProgress.updateLearningProgress)

module.exports = router