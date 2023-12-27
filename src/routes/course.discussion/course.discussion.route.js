const express = require('express'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    courseMiddleware = require('../../middlewares/course.middleware'),
    controller = require('../../controllers/course.discussion'),
    router = express.Router()

router.get("/course-discussions", verifyToken, controller.courseDiscussion.getAllCourseDiscussion)
router.get("/course-discussions/discussions/:id", controller.discussion.getDiscussionById)
router.post("/course-discussions/discussions", verifyToken, controller.discussion.createDiscussionByIdCourse)
router.post("/course-discussions/discussions/commentar", verifyToken, controller.commentarDiscussion.createCommentarByIdDiscussion)

module.exports = router
