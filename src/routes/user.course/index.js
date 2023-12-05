const express = require("express"),
    userCourseRoutes = require('./user.course.route'),
    userWishlistRoutes = require('./user.wishlist.route'),
    router = express.Router()
    
    router.use('/user-courses', userCourseRoutes)
    router.use('/wishlists', userWishlistRoutes)

module.exports = router
