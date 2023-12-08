const mysql = require('mysql')
const dotEnv = require("dotenv")
dotEnv.config();

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  connection.connect((err) => {
    if (err) {
      console.error('Koneksi ke database gagal: ', err);
      return;
    }
    console.log('Koneksi ke database berhasil.');
  
    // Query untuk mendapatkan daftar tabel dalam database
    connection.query('SHOW TABLES', (err, results) => {
      if (err) {
        console.error('Gagal mendapatkan daftar tabel: ', err);
        return;
      }
  
      const tables = results.map((table) => table[`Tables_in_${connection.config.database}`]);
  
      // Hapus setiap tabel dari database dengan CASCADE
      tables.forEach((table) => {
        connection.query(`DROP TABLE ${table} CASCADE`, (err) => { // Menambahkan CASCADE di sini
          if (err) {
            console.error(`Gagal menghapus tabel ${table}: `, err);
          } else {
            console.log(`Tabel ${table} berhasil dihapus.`);
          }
        });
      });
  
      // Tutup koneksi setelah selesai
      connection.end((err) => {
        if (err) {
          console.error('Gagal menutup koneksi: ', err);
          return;
        }
        console.log('Koneksi ditutup.');
      });
    });
  });