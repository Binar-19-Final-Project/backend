const jwt = require("jsonwebtoken"),
    utils = require('../utils/utils'),
    { JWT_SECRET_KEY } = require('../config')


const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    if (!authHeader) return res.status(401).json(utils.apiError("Silahkan login terlebih dahulu"))
    
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.status(401).json(utils.apiError("Silahkan login terlebih dahulu"))

    /* const jwtPayload = jwt.verify(token, JWT_SECRET_KEY)
    if (!jwtPayload) {
      return res.status(401).json(utils.apiError("Token tidak valid. Silahkan login ulang"))
    }
    
    res.user = jwtPayload

    return next() */

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return res.status(401).json(utils.apiError("Token kedaluwarsa, silahkan login ulang"));
        } else if (err instanceof jwt.JsonWebTokenError) {
          return res.status(401).json(utils.apiError("Token tidak valid. Silahkan login ulang"));
        } else {
          console.log(err)
          return res.status(500).json(utils.apiError("Kesalahan pada internal server"));
        }
      } else {
        res.user = decoded;
        return next();
      }
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
  }
}

module.exports = { verifyToken }
