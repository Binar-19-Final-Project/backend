const express = require("express"),
    userLearningProgress = require('./user.learning.progress.route'),
    router = express.Router()
    
router.use(userLearningProgress)

module.exports = router
