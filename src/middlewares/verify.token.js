const jwt = require("jsonwebtoken"),
    utils = require('../utils/utils'),
    { JWT_SECRET_KEY } = require('../config')


const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    if (!authHeader) return res.status(401).json(utils.apiError("Silahkan login terlebih dahulu"))
    
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.status(401).json(utils.apiError("Silahkan login terlebih dahulu"))

    const jwtPayload = jwt.verify(token, JWT_SECRET_KEY)
    if (!jwtPayload) return res.status(401).json(utils.apiError("Silahkan login terlebih dahulu"))
    
    res.user = jwtPayload

    return next()
  } catch (error) {
    console.log(error)
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json(utils.apiError("Silahkan login ulang"))
    } else {
        return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
    }
    
  }
}

module.exports = { verifyToken }
