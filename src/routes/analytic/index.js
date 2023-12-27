const express = require("express"),
  analyticRoute = require('./analytics.route'),
  router = express.Router();

router.use("/analytics", analyticRoute)

module.exports = router
