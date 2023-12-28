const express = require('express'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    controller = require('../../controllers/course.discussion'),
    router = express.Router()

router.get("/course-discussions", verifyToken, checkRole('admin', 'instructor'), controller.courseDiscussion.getAllCourseDiscussion)
router.get("/course-discussions/instructors", verifyToken, checkRole('admin'), controller.courseDiscussion.getCourseDiscussionByIdInstructor)

module.exports = router
