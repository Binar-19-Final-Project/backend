
module.exports = {
    filterSearch: async (filter, search) => {
        if(search) {
            filter.OR = [
                { title: { contains: search } }
            ]
        }

        return filter
    },

    filterCategory: async (filter, category) => {
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

        return filter
    },

    filterLevel: async (filter, level) => {
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

        return filter
    },

    filterType: async (filter, type) => {
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

        return filter
    },

    filterPromo: async (filter, promo) => {
        if (promo) {
            filter = {
                ...filter,
                isPromo: true
            }
        }

        return filter
    },

    orderByLatest: async (orderBy, latest) => {
        if(latest) {
            orderBy = [
                {
                    createdAt: 'desc'
                }
            ]
        }

        return orderBy
    },

    orderByPopular: async (orderBy, popular) => {
        if(popular) {
            orderBy = [
                {
                    taken: 'desc'
                }
            ]
        }
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