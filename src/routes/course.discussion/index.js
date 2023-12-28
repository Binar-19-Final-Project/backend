const express = require("express"),
  courseDiscussionROute = require('./course.discussion.route'),
  router = express.Router();

router.use(courseDiscussionROute)

module.exports = router
