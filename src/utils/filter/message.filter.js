
module.exports = {
    filterMessage: async ({ search, category, level, type, promo, popular, latest }) => {
        let message = "Berhasil mengambil data course"
            
        if (search) {
            message += ` berdasarkan kata kunci '${search}'`
        } 

        if (category) {
            message += ` berdasarkan kategori '${category}'`
        }

        if (level) {
            message += ` berdasarkan level '${level}'`
        }

        if (type) {
            message += ` berdasarkan '${type}'`
        }

        if (promo) {
            message += ` berdasarkan promo`
        }

        if (popular) {
            message += ` berdasarkan popular`
        }

        if (latest) {
            message += ` berdasarkan terbaru`
        }

        return message
    }
}