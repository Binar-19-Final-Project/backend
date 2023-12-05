const express = require("express"),
    userCourseRoutes = require('./user.course.route'),
    userWishlistRoutes = require('./user.wishlist.route'),
    router = express.Router()
    
    router.use(userCourseRoutes)
    router.use(userWishlistRoutes)

module.exports = router
