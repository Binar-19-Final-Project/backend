const { body } = require("express-validator")

module.exports = {
  instructor: [
    body("name").notEmpty().withMessage("name is required")
  ],
  
  promo: [
    body("name").notEmpty().withMessage("Nama wajib diisi"),
    body("name").isString().withMessage("Nama harus berupa karakter"),
    body("discount").notEmpty().withMessage("Diskon wajib diisi"),
    body("discount").isInt().withMessage("Diskon harus berupa angka"),
    body("discount").isInt({min: 1, max: 99}).withMessage("Diskon harus lebih dari 0 dan kurang dari 100"),
    body("expiredAt").notEmpty().withMessage("Tanggal kadaluarsa wajib diisi"),
    body("expiredAt").isISO8601().withMessage("Tanggal kadaluarsa harus berupa tanggal dan waktu"),
    body("expiredAt").isAfter(new Date().toDateString()).withMessage("Tanggal kadaluarsa harus melewati tanggal dan waktu sekarang")
  ],
};
