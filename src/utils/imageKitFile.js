const db = require('../../prisma/connection'),
      imageKit = require('./imageKit')

module.exports = {
    upload: async (file) => {

        try {

            const stringFile = file.buffer.toString('base64')
            const originalFileName = file.originalname

            const uploadFile = await imageKit.upload({
                fileName: originalFileName,
                file: stringFile
            })

            const data = {
                url: uploadFile.url,
                name: uploadFile.name
            }

            return data
            
        } catch (error) {
            console.log(error)
            return false
        }
    },

    delete: async (fileName) => {
        try {

            const file = await imageKit.listFiles({
                searchQuery: `name = "${fileName}"`
            })

            await imageKit.deleteFile(file[0].fileId)

            return true
            
        } catch (error) {
            console.log(error)
            return false
        }
    }
}