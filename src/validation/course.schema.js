const { body } = require("express-validator");

module.exports = {
  instructor: [
    body("name")
        .notEmpty().withMessage("Nama tidak boleh kosong")],

  course: [
    body("title").notEmpty().withMessage("Judul kelas tidak boleh kosong"),
    body("courseCategoryId").notEmpty().withMessage("Kategori kelas tidak boleh kosong"),
    body("courseTypeId").notEmpty().withMessage("Tipe kelas tidak boleh kosong"),
    body("courseLevelId").notEmpty().withMessage("Level kelas tidak boleh kosong"),
    body("price").notEmpty().withMessage("Harga kelas tidak boleh kosong"),
    body("courseInstructorId").notEmpty().withMessage("Instructor kelas tidak boleh kosong"),
    body("description").notEmpty().withMessage("Deskripsi kelas tidak boleh kosong"),
    body("isPublished").notEmpty().withMessage("Status publish tidak boleh kosong"),
  ],

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
        .optional({values: null})
        .isInt({ min: 1 }).withMessage("Urutan harus berupa angka dan minimal 1"),
    body("videoUrl")
        .notEmpty().withMessage("Link video tidak boleh kosong"),
    body("duration")
        .notEmpty().withMessage("Durasi tidak boleh kosong")
        .isInt({ min: 1 }).withMessage("Durasi harus berupa angka dan minimal 1 menit"),
    body("isDemo")
        .notEmpty().withMessage("Status demo konten tidak boleh kosong")
        .isBoolean().withMessage("Status demo harus berupa boolean"),
    body("moduleId")
        .notEmpty().withMessage("Module id tidak boleh kosong")
        .isInt().withMessage("Module id harus berupa angka"),
  ],

  category: [
    body("name")
        .notEmpty().withMessage("Nama Kategori tidak boleh kosong"),
    body("isPublished")
        .notEmpty().withMessage("Status kategori tidak boleh kosong")
        .isBoolean().withMessage("Status kategori harus berupa boolean")
  ],

  level: [
    body("name")
        .notEmpty().withMessage("Nama level tidak boleh kosong"),
  ],
};
