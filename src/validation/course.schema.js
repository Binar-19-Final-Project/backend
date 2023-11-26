const { body } = require("express-validator")

module.exports = {
  instructor: [
    body("name").notEmpty().withMessage("name is required")
  ],
};
