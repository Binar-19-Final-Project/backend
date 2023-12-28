const db = require('../../prisma/connection')

module.exports = {
    createUserLearningProgress: async (contentId, userCourseId) => {
        try {

            await db.userLearningProgress.create({
                data: {
                    isFinished: false,
                    contentId: contentId,
                    userCourseId: userCourseId
                }
            })

            return true
            
        } catch (error) {
            console.log(error)
            return false
        }
    }
}