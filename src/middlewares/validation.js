const { validationResult } = require("express-validator"),
  utils = require('../utils/utils')

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      let errorMessage
        errors.array().forEach((error) => {
          errorMessage = error.msg
        })
  
      return res.status(422).json(utils.apiError(errorMessage))

    }

    return next()
  }

}

module.exports = validate
