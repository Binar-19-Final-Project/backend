
module.exports = {
    filterWhereCondition: async (status) => {

        let where = {}

        if (status) {
            /* const learningStatussess = Array.isArray(learningStatus) ? learningStatus : [learningStatus] */
            if(status === 'Cancel') {
                where.status = 'Cancel'
            } else if (status === 'Success') {
                where.status = 'Success'
            } else if (status === 'Pending') {
                where.status = 'Pending'
            }
        }

        return where
    },

    filterOrderBy: async (popular, latest) => {

        let orderBy = []

        if(latest) {
            orderBy = [
                {
                    order: {
                        createdAt: 'desc'
                    }
                }
            ]
        }

        return orderBy
    },

}