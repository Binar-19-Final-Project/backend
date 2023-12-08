const express = require("express"),
    userCourseRoutes = require('./user.course.route'),
    userWishlistRoutes = require('./user.wishlist.route'),
    checkRoutes = require('./check.route'),
    router = express.Router()
    
    router.use('/user-courses', userCourseRoutes)
    router.use('/wishlists', userWishlistRoutes)
    router.use(checkRoutes)

module.exports = router
