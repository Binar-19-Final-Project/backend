const jwt = require("jsonwebtoken"),
    bcrypt = require("bcrypt")


const { JWT_SECRET_KEY } = require('../config')

module.exports = {

    apiSuccess: (msg, data, extraData = {}) => {
        const response = {
            error: false,
            message: msg,
            ...extraData, 
            data: data
          };
          return response;
    },

    apiError: (msg) => {
        const response = {}
        response.error = true
        response.message = msg
        
        return response
    },

    exclude: (model, keys) => {
        return Object.fromEntries(
            Object.entries(model).filter(([key]) => !keys.includes(key))
        );
    },

    createJwt: (payload) => {
        try {
            return jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "6h"})
        } catch (error) {
            console.log(error)
        }
    },

    createHashData: async (data, saltRounds = 10) => {
        try {
            const hashedData = await bcrypt.hash(data, saltRounds)
            return hashedData
        } catch (error) {
            console.log(error)
        }
    },

    verifyHashData: async (unhashed, hashed) => {
        try {
            const match = await bcrypt.compare(unhashed, hashed)
            return match
        } catch (error) {
            console.log(error)
        }
    },

    generateOtp: async () => {
        try {
            return `${Math.floor(100000 + Math.random() * 900000)}`
        } catch (error) {
            console.log(error)
        }
    }
}
