module.exports = {

    filterWhereCondition: async (filter, active) => {

        if (active) {
            filter = {
                ...filter,
                isPublished: true
            }
        }
    
        return filter
    },

    message: async (total, active) => {

        let message = "Berhasil mengambil data course"

        if (total) {
            message += ` berdasarkan total`
        }

        if (active) {
            message += ` berdasarkan status active`
        }

        return message
    }
}