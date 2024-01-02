const message = require('./message.filter'),
    course = require('./course.filter.j'),
    userCourse = require('./userCourse.filter'),
    analytic = require('./analytic.filter'),
    order = require('./order.filter')

module.exports = {
    message,
    course,
    userCourse,
    analytic,
    order
}