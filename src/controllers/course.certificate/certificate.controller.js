const db = require('../../../prisma/connection'),
  utils = require('../../utils/utils'),
  puppeteer = require('puppeteer'),
  { Storage } = require('@google-cloud/storage');

module.exports = {
  createCertificate: async (req, res) => {
    try {
      const { name, course } = req.body

      /* const userId = res.user.id
      const courseId = req.params.userId */

      /* const user = await db.user.findFirst({
        where: {
          id: userId
        }
      }) */

      /* const name = user.name

      const course = await db.course.findFirst({
        where: {
          id: parseInt(courseId)
        }
      }) */

      /* const courseName = course.title */


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

        const pdfPath = './sertifikatss.pdf';
        await page.pdf({ path: pdfPath, format: 'A4' });

        await browser.close();

        return pdfPath;
      };

      const uploadFileToGCS = async (pdfPath) => {
        const storage = new Storage({
          projectId: 'submission-mgca-mnurafifudin',
          keyFilename: 'editor-ilearn.json',
        });

        const bucketName = 'sertif-ilearn';
        const destinationFileName = 'sertifikatssssadsfdsdsa.pdf';

        await storage.bucket(bucketName).upload(pdfPath, {
          destination: destinationFileName,
          resumable: false,
          gzip: true,
        })

        const file = storage.bucket(bucketName).file(destinationFileName);
        await file.makePublic()

        return `gs://${bucketName}/${destinationFileName}`;
      }

      const pdfPath = await generatePDF();
      const gcsPath = await uploadFileToGCS(pdfPath);

      return res.status(201).json(utils.apiSuccess(`Sertifikat berhasil dicetak dan disimpan di Google Cloud Storage: ${gcsPath}`));
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan pada internal server"));
    }
  },
};
