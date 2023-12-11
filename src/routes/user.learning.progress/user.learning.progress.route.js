const express = require('express'),
    controller = require('../../controllers/user.learning.progress'),
    {verifyToken} = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.get('/', verifyToken, checkRole('user'), controller.userLearningProgress.getLearningProgress)
router.put('/', verifyToken, checkRole('user'), controller.userLearningProgress.updateLearningProgress)

module.exports = router