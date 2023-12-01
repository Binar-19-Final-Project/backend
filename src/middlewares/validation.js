const { validationResult } = require("express-validator"),
  utils = require('../utils/utils')

  const validate = (validations) => {
    return async (req, res, next) => {
      const errors = []
  
      for (const validation of validations) {
        await validation.run(req)
        const errorMessages = validationResult(req)
        if (!errorMessages.isEmpty()) {
          errors.push(errorMessages.array()[0].msg)
        }
      }
  
      if (errors.length !== 0) {
        return res.status(422).json(utils.apiError(errors[0]))
      }
  
      return next()
    }
  }

module.exports = validate

