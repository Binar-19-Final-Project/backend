
module.exports = {

    filterWhereCondition: async (filter, search, category, level, type, promo) => {
        if(search) {
            filter.OR = [
                { title: { contains: search } }
            ]
        }

        if(category) {
            const categories = Array.isArray(category) ? category : [category];
                filter = {
                    ...filter,
                    courseCategory: {
                        slug: {
                            in: categories,
                        },
                    },
                }
        }

        if (level) {
            const levels = Array.isArray(level) ? level : [level]
            filter = {
                ...filter,
                courseLevel: {
                    slug: {
                        in: levels,
                    },
                },
            };
        }

        if (type) {
            const types = Array.isArray(type) ? type : [type]
            filter = {
                ...filter,
                courseType: {
                    slug: {
                        in: types
                    }
                }
            }
        }

       
        if (promo) {
            filter = {
                ...filter,
                isPromo: true
            }
        }
    
        return filter
    },

    filterOrderBy: async (popular, latest) => {

        let orderBy = []

        if(latest) {
            orderBy = [
                {
                    createdAt: 'desc'
                }
            ]
        }

        if(popular) {
            orderBy = [
                {
                    taken: 'desc'
                }
            ]
        }

        return orderBy
    },

    messageResponse: async ({ search, category, level, type, promo, popular, latest }) => {
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