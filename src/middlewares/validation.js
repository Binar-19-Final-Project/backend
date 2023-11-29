const { validationResult } = require("express-validator"),
  utils = require('../utils/utils')

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const errorMessage = errors.array().reduce((acc, error) => {
        const { path, msg } = error
        if (!acc[path]) {
          acc[path] = { messages: [] }
        }
        acc[path].messages.push(msg)
        return acc
      }, {})
  
      return res.status(422).json(utils.apiError("Data yang diberikan tidak valid", errorMessage))
    }

    return next()
  }

}

module.exports = validate
