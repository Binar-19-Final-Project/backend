
module.exports = {
    filterWhereCondition: async (userId, filter, category, level, promo, learningStatus) => {
        filter.userId = userId

        if (!filter.course) {
            filter.course = {}
        }

        if (category) {
            const categories = Array.isArray(category) ? category : [category]
            filter.course.courseCategory = {
                slug: {
                    in: categories,
                },
            }
        }

        if (level) {
            const levels = Array.isArray(level) ? level : [level]
            filter.course.courseLevel = {
                slug: {
                    in: levels,
                },
            }
        }

        if (promo) {
            filter.course = {
                isPromo: true
            }
            
        }

        if (learningStatus) {
            /* const learningStatussess = Array.isArray(learningStatus) ? learningStatus : [learningStatus] */
            if(learningStatus === 'In Progress') {
                filter.status = 'In Progress'
            } else if (learningStatus === 'Selesai') {
                filter.status = 'Selesai'
            } 
        }

        return filter
    },

    filterOrderBy: async (popular, latest) => {

        let orderBy = []

        if(latest) {
            orderBy = [
                {
                    course: {
                        createdAt: 'desc'
                    }
                }
            ]
        }

        if(popular) {
            orderBy = [
                {
                    course: {
                        taken: 'desc'
                    }
                }
            ]
        }

        return orderBy
    },

}