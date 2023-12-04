const course = require('./course.controller'),
    courseInstructor = require('./course.instructor.controller'),
    coursePromo = require('./course.promo.controller'),
    courseModule = require('./course.module.controller'),
    courseContent = require('./course.content.controller'),
    courseCategory = require('./course.category.controller'),
    courseType = require("./course.type.controller")

module.exports = {
    course,
    courseInstructor,
    coursePromo,
    courseModule,
    courseContent,
    courseCategory,
    courseType
}