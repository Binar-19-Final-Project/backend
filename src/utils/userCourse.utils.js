
module.exports = {
    
    filterSearch: async (userId, filter, search) => {
        if(search) {
            filter.OR = [
                { title: { contains: search } }
            ]
        }

        return filter
    },

    filterCategory: async (userId, filter, category) => {
        if(category) {
            const categories = Array.isArray(category) ? category : [category];
                filter = {
                    ...filter,
                    userId,
                    course: {
                        courseCategory: {
                            slug: {
                                in: categories,
                            },
                        },
                    }
                }
        }

        return filter
    },

    filterLevel: async (userId, filter, level) => {
        if (level) {
            const levels = Array.isArray(level) ? level : [level]
            filter = {
                ...filter,
                userId,
                course: {
                    courseLevel: {
                        slug: {
                            in: levels,
                        },
                    },
                }
            };
        }

        return filter
    },

    filterType: async (userId, filter, type) => {
        if (type) {
            const types = Array.isArray(type) ? type : [type]
            filter = {
                ...filter,
                userId,
                course: {
                    courseType: {
                        slug: {
                            in: types
                        }
                    }
                }
            }
        }

        return filter
    },

    filterPromo: async (userId, filter, promo) => {
        if (promo) {
            filter = {
                ...filter,
                userId,
                course: {
                    isPromo: true
                }
            }
        }

        return filter
    },

    filterLearningStatus: async (userId, filter, learningProgress) => {
        if (learningProgress) {
            const learningProgresses = Array.isArray(learningProgress) ? learningProgress : [learningProgress]
            filter = {
                ...filter,
                    status: {
                        in: learningProgresses,
                    },
            }
        }

        return filter
    },

    orderBy: async (popular, latest) => {

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