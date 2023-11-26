
module.exports = {
    success: (msg, key, data) => {
        const response = {}
        response.error = false
        response.message = msg
        response[key] = data
        
        return response
    },

    error: (msg) => {
        const response = {}
        response.error = true
        response.message = msg
        
        return response
    }
}