const { body } = require("express-validator")

module.exports = {
  register: [
    body("name")
        .notEmpty().withMessage("Nama tidak boleh kosong")
        .matches(/^[a-zA-Z\s'-]+$/).withMessage("Nama tidak boleh mengandung karakter spesial")
        .isString().withMessage("tipe data nama string"),
    body("email")
        .notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
    body("phone")
        .notEmpty().withMessage("Nomor telepon tidak boleh kosong").isInt().withMessage("Nomor telepon tidak valid")
        .isInt().withMessage("tipe data phone integer"),
    body("password")
        .notEmpty().withMessage("Password tidak boleh kosong")
        .isLength({ min: 8 }).withMessage("Password minimal 8 karakter")
        .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage("Password harus mengandung setidaknya satu huruf kapital dan satu angka")
        .isString().withMessage("tipe data string"),
    body("confPassword")
        .notEmpty().withMessage("Konfirmasi password tidak boleh kosong")
        .custom((confPassword, { req }) => {
            if (confPassword !== req.body.password) {
                throw new Error("Password dan konfirmasi password tidak cocok");
            }
            return true;
        })
        .isString().withMessage("tipe data confPassoword string"),
  ],

  login: [
    body("email")
        .notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
    body("password")
        .notEmpty().withMessage("Password tidak boleh kosong")
        .isLength({ min: 8 }).withMessage("Password minimal 8 karakter")
        .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage("Password harus mengandung setidaknya satu huruf kapital dan satu angka")
        .isString().withMessage("tipe data password string"),
  ],

  verifyUser: [
    body("email")
        .notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
    body("otp")
        .notEmpty().withMessage("Otp tidak boleh kosong")
        .isLength({ min: 6, max: 6}).withMessage("Otp berisi 6 angka")
        .isString().withMessage("tipe data otp string"),
  ],

  requestResetPassword: [
    body("email")
        .notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
  ],

  resetPassword: [
    // body("resetToken").notEmpty("Reset token tidak boleh kosong"),
    body("password")
        .notEmpty().withMessage("Password baru tidak boleh kosong")
        .isLength({ min: 8 }).withMessage("Password baru minimal 8 karakter")
        .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage("Password baru harus mengandung setidaknya satu huruf kapital dan satu angka")
        .isString().withMessage("tipe data password string"),
    body("confPassword")
        .notEmpty().withMessage("Konfirmasi password baru tidak boleh kosong")
        .custom((confPassword, { req }) => {
            if (confPassword !== req.body.password) {
                throw new Error("Password baru dan konfirmasi password baru tidak cocok");
            }
            return true;
        })
        .isString().withMessage("tipe data confPassword string"),
  ],

  resendOtp: [
    body("email")
        .notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
  ],

  changePassword: [
    body("oldPassword")
        .notEmpty().withMessage("Password lama tidak boleh kosong")
        .isLength({ min: 8 }).withMessage("Password lama lama minimal 8 karakter")
        .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage("Password lama harus mengandung setidaknya satu huruf kapital dan satu angka"),
    body("newPassword")
        .notEmpty().withMessage("Password baru tidak boleh kosong")
        .isLength({ min: 8 }).withMessage("Password baru minimal 8 karakter")
        .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage("Password baru harus mengandung setidaknya satu huruf kapital dan satu angka"),
    body("confPassword")
        .notEmpty().withMessage("Konfirmasi password baru tidak boleh kosong")
        .custom((confPassword, { req }) => {
            if (confPassword !== req.body.newPassword) {
                throw new Error("Password baru dan konfirmasi password baru tidak cocok");
            }
            return true;
        })
  ],

  updateProfile: [
    body("name")
        .notEmpty().withMessage("Nama tidak boleh kosong")
        .matches(/^[a-zA-Z\s'-]+$/).withMessage("Nama tidak boleh mengandung karakter spesial")
        .isString().withMessage("tipe data nama string"),
    body("phone")
        .notEmpty().withMessage("Nomor telepon tidak boleh kosong").isInt().withMessage("Nomor telepon tidak valid")
        .isInt().withMessage("tipe data phone integer"),
    body("country")
        .optional({values: null}),
    body("city")
        .optional({values: null})
  ],

  updateProfilePhoto: [
    body("photoProfile")
        .optional({values: null})
        // .custom((value, { req }) => {
        //     console.log(req.file.originalname)
        //     return true
        // })
  ]
};
