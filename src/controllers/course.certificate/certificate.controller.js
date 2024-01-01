
const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    puppeteer = require('puppeteer'),
    { google } = require('googleapis'),
    fs = require('fs')


module.exports = {

    createCertificate: async (req, res) => {
        try {
            const { name, course } = req.body
            
            const generatePDF = async () => {
                const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
                const page = await browser.newPage();
                
                const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>Sertifikat Course</title>
                  <style>
                    @page {
                      size: A4 landscape;
                      margin: 0;
                    }
                    body {
                      margin: 0;
                      font-family: Arial, sans-serif;
                    }
                    .certificate {
                      width: 29.7cm; /* Lebar A4 dalam orientasi lanskap */
                      height: 21cm; /* Tinggi A4 dalam orientasi lanskap */
                      background-color: #fff;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      padding: 2cm;
                      box-sizing: border-box;
                    }
                    .certificate-content {
                      text-align: center;
                    }
                    .certificate-content h1 {
                      margin-bottom: 20px;
                    }
                    .certificate-content p {
                      margin-bottom: 10px;
                    }
                    /* Tambahan gaya lainnya */
                  </style>
                </head>
                <body>
                  <div class="certificate">
                    <div class="certificate-content">
                      <h1>Sertifikat Course</h1>
                      <p>Nama: ${name}</p>
                      <p>Kursus: ${course}</p>
                      <!-- Informasi lainnya -->
                    </div>
                  </div>
                </body>
                </html>    
                `;
              
                await page.setContent(htmlContent);

                const pdfPath = './sertifikatss.pdf'
              
                await page.pdf({ path: pdfPath, format: 'A4' })
              
                await browser.close();

                const driveAuth = new google.auth.GoogleAuth({
                    keyFile: './ilearntech.json',
                    scopes: ['https://www.googleapis.com/auth/drive.file']
                })

                const auth = await driveAuth.getClient()
                    uploadToDrive(auth, pdfPath)

                return pdfPath
              }

              const uploadToDrive = (auth, pdfPath) => {
                return new Promise((resolve, reject) => {
                    const drive = google.drive({ version: 'v3', auth });

                    const fileMetadata = {
                        name: 'sertifikat.pdf',
                        parents: ['1GYI7cQ_fH9QCsniWqJal2ZC2JcL-2O3U'],
                    };

                    console.log('Path file PDF =========================================', pdfPath);

                    const media = {
                    mimeType: 'application/pdf',
                    body: fs.createReadStream(pdfPath),
                    };

                    drive.files.create(
                    {
                        resource: fileMetadata,
                        media: media,
                        fields: 'id',
                    },
                    (error, response) => {
                        if (error) {
                        console.error('Error saat mengunggah file:', error);
                        reject(error);
                        } else {
                        console.log('File berhasil diunggah', response);
                        resolve(response);
                        }
                    }
                    );
                });
              }

              const pdfPath = await generatePDF()

            return res.status(201).json(utils.apiSuccess(`Sertifikat berhasil dicetak dan disimpan di Google Drive: ${pdfPath}`))


        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }

}
