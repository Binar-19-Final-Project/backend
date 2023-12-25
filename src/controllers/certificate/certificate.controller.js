const db = require('../../../prisma/connection'),
    fs = require('fs'),
    moment = require('moment'),
    PDFDocument = require('pdfkit')

module.exports = {
    createCertificate: async (req, res) =>  {
        try {
            
            const { name } = req.body

            const { courseId } = req.params
            
            const course = await db.course.findFirst({
                where: {
                    id: parseInt(courseId)
                }
            })

            const courseName = course.title

            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4'
            })
    
            doc.pipe(fs.createWriteStream(`${name}.pdf`))
    
            doc.image('certificate.jpg', 0, 0, { width: 842 })
    
            doc.font('Montserrat.otf')
    
            doc.fontSize(60).text(name, 80, 265, {
                align: 'center'
            })
    
            doc.fontSize(60).text(courseName, 80, 100, {
                align: 'center'
            })
    
            doc.end()
    
            return res.status(200).json(utils.apiSuccess('Berhasil mencetak sertifikat'))
                
        } catch (error) {
            console.log(error)
            return error 
        }
    },
}