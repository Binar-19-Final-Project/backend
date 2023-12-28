const express = require("express"),
    authRoute = require('./auth.route'),
    authAdminRoute = require('./admin.auth.route'),
    authInstructorRoute = require('./instructor.auth.route'),
    router = express.Router()
    
router.use(authRoute)
router.use(authAdminRoute)
router.use(authInstructorRoute)

module.exports = router
