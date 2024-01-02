const express = require("express"),
    authRoute = require('./auth'),
    courseRoute = require('./course'),
    courseDiscussion = require('./course.discussion'),
    analyticRoute = require('./analytic'),
    orderRoute = require('./order'),
    userCoursesRoute = require('./user.course'),
    userProfileRoute = require('./user.profile'),
    notificationRoute = require('./notification'),
    userLearningProgress = require('./user.learning.progress'),
    router = express.Router()

router.use("/auth", authRoute)
router.use(courseDiscussion)
router.use(courseRoute)
router.use(analyticRoute)
router.use(orderRoute)
router.use(userCoursesRoute)
router.use("/profile", userProfileRoute)
router.use("/notifications", notificationRoute)
router.use("/learning-progress", userLearningProgress)

module.exports = router
