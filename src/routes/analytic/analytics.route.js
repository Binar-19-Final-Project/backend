const express = require('express'),
    { verifyToken } = require('../../middlewares/verify.token'),
    checkRole = require('../../middlewares/check.role'),
    controller = require('../../controllers/analytics'),
    router = express.Router()

router.get("/courses", verifyToken, checkRole('admin'), controller.courseAnalytics.getCourse)
router.get("/courses/precentage", verifyToken, checkRole('admin'), controller.courseAnalytics.getCoursePrecentage)
router.get("/courses/totalEnroll", verifyToken, checkRole('admin'), controller.courseAnalytics.totalEnroll)
router.get("/courses/courseTaken", verifyToken, checkRole('admin'), controller.courseAnalytics.courseTaken)
router.get("/courses/courseInCategory", verifyToken, checkRole('admin'), controller.courseAnalytics.totalCourseInCategory)
router.get("/courses/instructors", verifyToken, checkRole('admin'), controller.courseAnalytics.totalInstructor)
router.get("/courses/courseInstructors", verifyToken, checkRole('admin'), controller.courseAnalytics.totalCourseByInstructor)
router.get("/courses/courseTypes", verifyToken, checkRole('admin'), controller.courseAnalytics.totalCourseByType)

router.get("/users/totalUsers", verifyToken, checkRole('admin'), controller.userAnalytics.totalUser)
router.get("/users/active", verifyToken, checkRole('admin'), controller.userAnalytics.userActive)

module.exports = router
