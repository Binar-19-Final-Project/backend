const { body } = require("express-validator")

module.exports = {
  register: [
    body("name")
        .notEmpty().withMessage("name wajib diisi"),
    body("email")
        .notEmpty().withMessage("Email wajib diisi").isEmail().withMessage("Format email tidak valid"),
    body("phone")
        .notEmpty().withMessage("Nomor Telepon wajib diisi").isInt().withMessage("Nomor telepon tidak valid"),
    body("password")
        .notEmpty().withMessage("Password wajib diisi")
        .isLength({ min: 8 }).withMessage("Password minimal 8 karakter")
        .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage("Password harus mengandung setidaknya satu huruf kapital dan satu angka"),
    body("confPassword")
        .notEmpty().withMessage("Konfirmasi password wajib diisi")
        .custom((confPassword, { req }) => {
            if (confPassword !== req.body.password) {
            throw new Error("Password dan konfirmasi password tidak cocok");
            }
            return true;
        }),
  ],
};
