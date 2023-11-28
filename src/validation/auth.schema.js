const { body } = require("express-validator")

module.exports = {
  register: [
    body("name")
        .notEmpty().withMessage("Nama tidak boleh kosong"),
    body("email")
        .notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
    body("phone")
        .notEmpty().withMessage("Nomor Telepon tidak boleh kosong").isInt().withMessage("Nomor telepon tidak valid"),
    body("password")
        .notEmpty().withMessage("Password tidak boleh kosong")
        .isLength({ min: 8 }).withMessage("Password minimal 8 karakter")
        .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage("Password harus mengandung setidaknya satu huruf kapital dan satu angka"),
    body("confPassword")
        .notEmpty().withMessage("Konfirmasi password tidak boleh kosong")
        .custom((confPassword, { req }) => {
            if (confPassword !== req.body.password) {
                throw new Error("Password dan konfirmasi password tidak cocok");
            }
            return true;
        }),
  ],

  login: [
    body("email")
        .notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
    body("password")
        .notEmpty().withMessage("Password tidak boleh kosong")
        .isLength({ min: 8 }).withMessage("Password minimal 8 karakter")
        .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage("Password harus mengandung setidaknya satu huruf kapital dan satu angka"),
  ],

  verifyUser: [
    body("email")
        .notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
    body("otp")
        .notEmpty().withMessage("Otp tidak boleh kosong")
        .isLength({ min: 6 }).withMessage("Otp berisi 6 angka"),
  ],

  requestResetPassword: [
    body("email")
        .notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
  ],

  resetPassword: [
    body("email")
        .notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
    body("otp")
        .notEmpty().withMessage("Otp tidak boleh kosong")
        .isLength({ min: 6 }).withMessage("Otp berisi 6 angka"),
    body("password")
        .notEmpty().withMessage("Password tidak boleh kosong")
        .isLength({ min: 8 }).withMessage("Password minimal 8 karakter")
        .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage("Password harus mengandung setidaknya satu huruf kapital dan satu angka"),
    body("confPassword")
        .notEmpty().withMessage("Konfirmasi password tidak boleh kosong")
        .custom((confPassword, { req }) => {
            if (confPassword !== req.body.password) {
                throw new Error("Password dan konfirmasi password tidak cocok");
            }
            return true;
        }),
  ],
};
