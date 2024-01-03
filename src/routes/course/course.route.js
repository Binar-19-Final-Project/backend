const express = require('express'),
    schema = require('../../validation/course.schema'),
    validate = require('../../middlewares/validation'),
    { verifyToken } = require('../../middlewares/verify.token'),
    multer = require('multer')(),
    checkRole = require('../../middlewares/check.role'),
    { getCourseMiddleware, courseContentMiddleware, courseDiscussionMiddleware, discussionMiddleware, commentarDiscussionMiddleware, courseCertificate, getCourseCertificate } = require('../../middlewares/course.middleware'),
    controller = require('../../controllers/course'),
    discussionController = require('../../controllers/course.discussion'),
    certificateController = require('../../controllers/course.certificate'),
    router = express.Router()

router.get('/', controller.course.getCourses)
router.get('/:id', getCourseMiddleware, controller.course.getCourseById)
router.put('/:courseId/publish', verifyToken, checkRole('admin'), controller.course.unpublishCourse)
router.post('/', multer.single('courseImage'), validate(schema.course), verifyToken, checkRole('admin'), controller.course.createCourse)
 
router.get('/:courseId/modules', controller.courseModule.getAllCourseModuleByCourseId)
router.get('/:courseId/modules/:moduleId', controller.courseModule.getCourseModuleByIdAndCourseId)

router.get('/:courseId/modules/:moduleId/contents/:contentId', verifyToken, courseContentMiddleware, controller.courseContent.getCourseContentByIdModuleAndCourse)

router.get('/:courseId/modules/:moduleId/contents', verifyToken, checkRole('admin'), controller.courseContent.getAllCourseContentByModuleAndCourseId)
router.put('/:courseId', verifyToken, checkRole('admin'), multer.single('courseImage'), validate(schema.course), controller.course.updateCourse)
router.put('/:courseId/promos', verifyToken, checkRole('admin'), controller.course.putPromoOnCourse)
router.delete('/:courseId/promos', verifyToken, checkRole("admin"), controller.course.cancelPromoOnCourse)

router.get("/:courseId/course-discussions", verifyToken, courseDiscussionMiddleware, discussionController.courseDiscussion.getCourseDiscussionByIdCourse)

router.get("/:courseId/discussions/:id", verifyToken, courseDiscussionMiddleware, discussionController.discussion.getDiscussionById)
router.post("/:courseId/discussions", verifyToken, discussionMiddleware, multer.single("photoDiscussion"), discussionController.discussion.createDiscussionByIdCourse)
router.put("/:courseId/discussions/:id", verifyToken, discussionMiddleware, multer.single("photoDiscussion"), discussionController.discussion.updateDiscussionByIdCourse)
router.put("/:courseId/discussions", verifyToken, discussionMiddleware, discussionController.discussion.closedDiscussionById)

router.post("/:courseId/commentars", verifyToken, commentarDiscussionMiddleware, multer.single("photoCommentar"), discussionController.commentarDiscussion.createCommentarByIdDiscussion)
router.put("/:courseId/commentars/:id", verifyToken, commentarDiscussionMiddleware, multer.single("photoCommentar"), discussionController.commentarDiscussion.updateCommentarByIdCourse)
router.get("/:courseId/commentars/:id", verifyToken, courseDiscussionMiddleware, discussionController.commentarDiscussion.getCommentarById)

router.post("/:courseId/certificates", verifyToken, checkRole("user"), /* courseCertificate, */ certificateController.certificate.createCertificate)
router.get("/:courseId/certificates/download", verifyToken, checkRole("user"), getCourseCertificate, certificateController.certificate.downloadCertificate)
router.get("/:courseId/certificates/linkedin", verifyToken, checkRole("user"), getCourseCertificate, certificateController.certificate.linkedinCertificate)


module.exports = router
