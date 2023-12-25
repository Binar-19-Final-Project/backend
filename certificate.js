   const fs = require('fs'),
    moment = require('moment'),
    PDFDocument = require('pdfkit')


    async function createCertificate()  {
        try {
            const name = "Afifudin"
            const courseName = "Javascript Dasar"
            
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

            return 'success'
            
        } catch (error) {
            console.log(error)
           return error 
        }
    }

    createCertificate()
    .then(result => {
        console.log('Hasil:', result)
    })
    .catch(err => {
        console.error('Terjadi kesalahan:', err)
    });