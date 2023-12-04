const express = require("express"),
  instructorRoute = require("./course.instructor"),
  courseRoute = require("./course"),
  promoRoute = require("./course.promo"),
  moduleRoute = require("./course.module"),
  contentRoute = require("./course.content"),
  typeRoute = require("./course.type"),
  categoryRoute = require("./course.category"),
  levelRoute = require("./course.level"),
  router = express.Router();

    
router.use('/course', courseRoute)
router.use('/course', instructorRoute)
router.use('/course', promoRoute)
router.use('/course', moduleRoute)
router.use('/course', contentRoute)
router.use('/course', typeRoute)
router.use('/category', categoryRoute)


module.exports = router;
