const db = require('../../../prisma/connection'),
  utils = require('../../utils/utils'),
  puppeteer = require('puppeteer'),
  { readFileSync } = require('fs'),
  { Storage } = require('@google-cloud/storage');

module.exports = {
  createCertificate: async (req, res) => {
    try {

      const userId = res.user.id
      const courseId = req.params.courseId

      const user = await db.user.findFirst({
        where: {
          id: userId
        }
      })

      const name = user.name

      const course = await db.course.findFirst({
        where: {
          id: parseInt(courseId)
        }
      })

      const courseName = course.title

      const generatePDF = async () => {
        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <style type="text/css">
              body,
              html {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                height: 100%;
                width: 100%;
                background-color: wheat;
              }
        
              .certificate {
                display: flex;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
        
              .container {
                position: relative;
                width: 95%;
                height: 90%;
                vertical-align: top;
              }
        
              .container::before,
              .container::after {
                content: "";
                position: absolute;
                width: 95%;
                height: 90%;
                border: 20px solid transparent;
              }
        
              .container::before {
                top: 0;
                left: 0;
                border-right-color: #ffbe05;
                border-bottom-color: #ffbe05;
              }
        
              .container::after {
                bottom: 0;
                right: 0;
                border-left-color: #1e3a5f;
                border-top-color: #1e3a5f;
              }
              */ .logo {
                color: tan;
              }
        
              .marquee {
                color: tan;
                font-size: 48px;
                margin: 20px;
              }
        
              .assignment {
                margin: 20px;
              }
        
              .person {
                border-bottom: 2px solid black;
                font-size: 32px;
                font-style: italic;
                margin: 20px auto;
                width: 400px;
              }
        
              .reason {
                margin: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="certificate">
                <div class="logo">An Organization</div>
        
                <div class="marquee">Certificate of Completion</div>
        
                <div class="assignment">This certificate is presented to</div>
        
                <div class="person">${name}</div>
        
                <div class="reason">
                  ${courseName}
                </div>
              </div>
            </div>
             
          </body>
        </html>
        `

        await page.setContent(htmlContent)

        const htmlDimensions = await page.evaluate(() => {
          const body = document.querySelector('body');
          return {
            width: body.offsetWidth,
            height: body.offsetHeight,
          };
        })

        const pdfPath = './sertifikatss.pdf';
        await page.pdf({ path: pdfPath, width: htmlDimensions.width, height:htmlDimensions.height })

        await browser.close();

        return pdfPath;
      };

      const uploadFileToGCS = async (pdfPath) => {
        const storage = new Storage({
          projectId: 'submission-mgca-mnurafifudin',
          keyFilename: 'editor-ilearn.json',
        });

        const bucketName = 'sertif-ilearn';
        const destinationFileName = `${name}-${courseName}.pdf`;

        await storage.bucket(bucketName).upload(pdfPath, {
          destination: destinationFileName,
          resumable: false,
          gzip: true,
        })

        const file = storage.bucket(bucketName).file(destinationFileName)

        await file.makePublic()

        const [metadata] = await file.getMetadata();
        /* const publicUrl = metadata.mediaLink; */

        const publicUrl = new URL(
          `https://storage.googleapis.com/${bucketName}/${destinationFileName}`
        );
  
        return publicUrl
      }

      const pdfPath = await generatePDF()
      const publicUrl = await uploadFileToGCS(pdfPath);

      const courseNametoLinkedIn = encodeURIComponent(courseName)
      const encodeCertUrl = encodeURIComponent(publicUrl)
      const randomCode = Math.floor(1000000 + Math.random() * 9000000)

      const addToLinkedIn = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${courseNametoLinkedIn}&organizationName=iLearnTech&issueYear=2024&issueMonth=1&expirationYear=2026&expirationMonth=5&certUrl=${encodeCertUrl}&certId=${randomCode}`

      const saveCertificate = await db.certificate.create({
        data:{
          addToLinkedin: addToLinkedIn,
          urlCertificate: publicUrl,
          courseId: course.id,
          userId: user.id
        }
      })

      return res.status(201).json(utils.apiSuccess(`Sertifikat berhasil dicetak dan disimpan di Google Cloud Storage`, saveCertificate));

      /* ${gcsPath} */
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan pada internal server"));
    }
  },

  getCertificate: async (req, res) => {
    try {
      
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan pada internal server"));
    }
  }
};
