const express = require('express'),
    controller = require('../../controllers/user.learning.progress'),
    {verifyToken} = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    router = express.Router()

router.put('/:userCourseId/contents/:contentId', verifyToken, checkRole('user'), controller.userLearningProgress.updateLearningProgress)
router.get('/:userCourseId/contents/:contentId', verifyToken, checkRole('user'), controller.userLearningProgress.getLearningProgress)

module.exports = router