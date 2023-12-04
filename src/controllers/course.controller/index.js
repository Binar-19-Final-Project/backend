const course = require("./course"),
  instructor = require("./course.instructor"),
  promo = require("./course.promo"),
  courseModule = require("./course.module"),
  content = require("./course.content");
(courseCategory = require("./course.category")),
  (courseType = require("./course.type")),
  (courseLevel = require("./course.level")),
  (courseUserWhislist = require("./course.user.whislist"));

module.exports = {
  course,
  instructor,
  promo,
  courseModule,
  content,
  courseType,
  courseCategory,
  courseLevel,
  courseUserWhislist,
};
