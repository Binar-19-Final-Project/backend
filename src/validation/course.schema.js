const { body } = require("express-validator");

module.exports = {
  instructor: [
    body("name")
        .notEmpty().withMessage("Nama tidak boleh kosong")],

  promo: [
    body("name")
        .notEmpty().withMessage("Nama tidak boleh kosong")
        .isString().withMessage("Nama harus berupa string"),
    body("discount")
        .notEmpty().withMessage("Diskon tidak boleh kosong")
        .isInt({ min: 1, max: 99 }).withMessage("Diskon harus berupa angka, lebih dari 0 dan kurang dari 100"),
    body("expiredAt")
        .notEmpty().withMessage("Tanggal kadaluarsa tidak boleh kosong")
        .isISO8601().withMessage("Tanggal kadaluarsa harus berupa tanggal dan waktu dengan format ISO 8601")
        .isAfter(new Date().toDateString()).withMessage("Tanggal kadaluarsa harus melewati tanggal dan waktu sekarang"),
  ],

  module: [
    body("title")
        .notEmpty().withMessage("Judul tidak boleh kosong")
        .isString().withMessage("Judul harus berupa string"),
    body("courseId")
        .notEmpty().withMessage("Course id tidak boleh kosong")
        .isInt({ min: 1 }).withMessage("Course id harus berupa angka dan tidak boleh kurang dari 1"),
  ],

  content: [
    body("title")
        .notEmpty().withMessage("Judul tidak boleh kosong")
        .isString().withMessage("Judul harus berupa string"),
    body("sequence")
        .notEmpty().withMessage("Urutan tidak boleh kosong")
        .isInt({ min: 1 }).withMessage("Urutan harus berupa angka dan minimal 1"),
    body("videoUrl")
        .notEmpty().withMessage("Link video tidak boleh kosong")
        .isURL().withMessage("Link video harus berupa link URL yang valid"),
    body("duration")
        .notEmpty().withMessage("Durasi tidak boleh kosong")
        .isInt({ min: 1 }).withMessage("Durasi harus berupa angka dan minimal 1 menit"),
    body("isFree")
        .notEmpty().withMessage("Tipe konten tidak boleh kosong")
        .isBoolean().withMessage("Tipe konten harus berupa boolean"),
    body("moduleId")
        .notEmpty().withMessage("Module id tidak boleh kosong")
        .isInt().withMessage("Module id harus berupa angka"),
  ],

  category: [
    body("name")
        .notEmpty().withMessage("Nama Kategori tidak boleh kosong"),
    body("urlPhoto")
        .notEmpty().withMessage("Foto tidak boleh kosong"),
  ],
};
