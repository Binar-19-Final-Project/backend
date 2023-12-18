const jwt = require("jsonwebtoken"),
    bcrypt = require("bcrypt"),
    slugify = require("slugify"),
    { JWT_SECRET_KEY } = require("../config")

module.exports = {

    apiSuccess: (msg, data, extraData = {}) => {
        const response = {
            status: 'success',
            message: msg,
            ...extraData, 
            value: data
          }
          return response
    },

    apiError: (msg, errors) => {
        const response = {
            status: 'error',
            message: msg,
            errors: errors, 
          }
          return response
    },

    exclude: (model, keys) => {
        return Object.fromEntries(
            Object.entries(model).filter(([key]) => !keys.includes(key))
        );
    },

    createJwt: async (payload) => {
        try {
            return jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "20h"})
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
    },

    createSlug: async (data) => {
        try {
            const dataSlug = await slugify(data, { lower: true, remove: /[*+~.()'"!:@]/g })
            return dataSlug
        } catch (error) {
            console.log(error)
        }
    },

    formatDate: async (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', options)
    },

    generateCodeCategory: async () => {
        try {
            return `${Math.floor(1000 + Math.random() * 9000)}`
        } catch (error) {
            console.log(error)
        }
    },
}
