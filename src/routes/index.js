const express = require("express"),
    authRoute = require('./auth'),
    courseRoute = require('./course'),
    orderRoute = require('./order'),
    userCoursesRoute = require('./user.course'),
    userProfileRoute = require('./user.profile'),
    checkAccessContentRoute = require('./check.access.content'),
    notificationRoute = require('./notification'),
    router = express.Router()
    
router.use("/auth", authRoute)
router.use(courseRoute)
router.use(orderRoute)
router.use(userCoursesRoute)
router.use(checkAccessContentRoute)
router.use("/profile", userProfileRoute)
router.use("/notifications", notificationRoute)

module.exports = router
