
module.exports = {
    filterWhereCondition: (userId, filter, category, level, promo) => {
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

        /* if (learningStatus) {
            const learningStatussess = Array.isArray(learningStatus) ? learningStatus : [learningStatus]
            filter
        } */

        if (promo) {
            filter.course.isPromo = true
        }

        return filter
    }
}