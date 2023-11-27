
module.exports =  {
    create: async () => {
        try {
            return `${Math.floor(100000 + Math.random() * 900000)}`
        } catch (error) {
            console.log(error)
        }
    },
}