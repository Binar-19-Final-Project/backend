/*    const fs = require('fs'),
    moment = require('moment'),
    PDFDocument = require('pdfkit')


    async function createCertificate()  {
        try {
            const name = "Nura Afifudin"
            const courseName = "Ilearn Javascript Dasar"
            
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
    }); */

    const puppeteer = require('puppeteer');

    async function generatePDFfromHTML(htmlContent, outputPath) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
    
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    
      // Mendapatkan ukuran elemen .sertifikat dari konten HTML
      const pdf = await page.pdf({
        path: outputPath,
        displayHeaderFooter: false,
        format: 'A4',
        printBackground: true, // Mengaktifkan pencetakan latar belakang
      });
    
      // Mengambil ukuran konten HTML
      const { width, height } = await page.$eval('.sertifikat', (element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
    
      // Mengatur ukuran halaman PDF sesuai dengan ukuran konten HTML
      await page.pdf({
        path: outputPath,
        displayHeaderFooter: false,
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
      });
    
      await browser.close();
    }
    
    // Gunakan fungsi dengan konten HTML dan path output
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Sertifikat Kursus Tech Stack</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f0f0;
        }
    
        .sertifikat {
          text-align: center;
          background-color: #fff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 600px;
        }
    
        h1 {
          font-size: 36px;
          margin-bottom: 20px;
          color: #333;
        }
    
        .recipient {
          font-weight: bold;
          font-size: 24px;
        }
    
        .course {
          font-style: italic;
          margin-top: 10px;
        }
    
        .tech-stack {
          margin-top: 20px;
        }
    
        ul {
          list-style: none;
          padding: 0;
          display: flex;
          justify-content: center;
        }
    
        ul li {
          margin: 0 10px;
          font-size: 18px;
          color: #444;
        }
    
        .date {
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }
    
        .signature {
          margin-top: 40px;
          border-top: 1px solid #ccc;
          padding-top: 10px;
          font-style: italic;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="sertifikat">
        <h1>Sertifikat</h1>
        <p>
          Diberikan kepada:
          <span class="recipient">Nama Penerima Sertifikat</span>
        </p>
        <p class="course">
          Telah menyelesaikan kursus mengenai Tech Stack:
        </p>
        <div class="tech-stack">
          <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
            <!-- Tambahkan teknologi lain sesuai kebutuhan -->
          </ul>
        </div>
        <p class="date">Diberikan pada: 27 Desember 2023</p>
        <p class="signature">Tanda Tangan</p>
      </div>
    </body>
    </html>
    `; // HTML Anda
    generatePDFfromHTML(htmlContent, 'custom.pdf')
      .then(() => console.log('PDF generated successfully'))
      .catch(err => console.error('Error generating PDF:', err));
    
