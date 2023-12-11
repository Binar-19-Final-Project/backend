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

  module: [
    body("title").notEmpty().withMessage("Judul wajib diisi"),
    body("title").isString().withMessage("Judul harus berupa karakter"),
    body("courseId").notEmpty().withMessage("Course id wajib diisi"),
    body("courseId").isInt().withMessage("Course id harus berupa angka"),
    body("courseId").isInt({min: 1}).withMessage("Course id tidak boleh kurang dari 1")
  ],

  content: [
    body("title")
        .notEmpty().withMessage("Judul wajib diisi")
        .isString().withMessage("Judul harus berupa karakter"),
    body("sequence")
        .isInt().optional({values: null}).withMessage("Urutan harus berupa angka")
        .isInt({min: 1}).optional({values: null}).withMessage("Urutan minimal 1"),
    body("videoUrl")
        .notEmpty().withMessage("Link video wajib diisi")
        .isURL().withMessage("Link video harus berupa link valid"),
    body("duration")
        .notEmpty().withMessage("Durasi wajib diisi")
        .isInt().withMessage("Durasi harus berupa menit")
        .isInt({min: 1}).withMessage("Durasi minimal 1 menit"),
    body("isFree")
        .notEmpty().withMessage("Type konten wajib diisi")
        .isBoolean().withMessage("Type konten harus berupa boolean"),
    body("moduleId")
        .notEmpty().withMessage("Module id wajib diisi")
        .isInt().withMessage("Module id harus berupa angka"),
  ],

  category:[
    body("name").notEmpty().withMessage("Nama Kategori wajib diisi"),
    body("urlPhoto").notEmpty().withMessage("Url Foto wajib diisi"),
  ],
};