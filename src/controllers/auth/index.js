const auth = require('./auth.controller'),
    authAdmin = require('./admin.auth.controller'),
    authInstructor = require('./instructor.auth.controller')

module.exports = {
    auth,
    authAdmin,
    authInstructor
}