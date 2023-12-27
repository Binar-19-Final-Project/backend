
module.exports = {

    filterWhereCondition: async (filter, search, category, level, type, promo, published) => {
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

        if (published) {
            filter = {
                ...filter,
                isPublished: true
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
}