const { body } = require("express-validator")

module.exports = {
  promo: [
    body("name").notEmpty().withMessage("name is required"),
    body("name").isString().withMessage("name must be type of string"),
    body("discount").notEmpty().withMessage("discount is required"),
    body("discount").isFloat().withMessage("discount must be type of number"),
    body("discount").isFloat({min: 1, max: 99}).withMessage("discount must more than 1 and less than 100"),
    body("expiredAt").notEmpty().withMessage("expired at is required"),
    body("expiredAt").isISO8601().withMessage("expired at must be type of date time"),
    body("expiredAt").isAfter(new Date().toDateString()).withMessage("expired at must after current date")
  ],
};
