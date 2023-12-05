const express = require("express"),
    authRoute = require('./auth'),
    courseRoute = require('./course'),
    orderRoute = require('./order'),
    userCoursesRoute = require('./user.course'),
    router = express.Router()
    
router.use("/auth", authRoute)
router.use("/courses", courseRoute)
router.use("/orders", orderRoute)
router.use("/user-courses", userCoursesRoute)

module.exports = router
