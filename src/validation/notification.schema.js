const { body } = require("express-validator")

module.exports = {
  notification: [
    body("notificationId")
        .notEmpty().withMessage("Notifikasi id harus diisi")
        .isInt().withMessage('Notifikasi id harus berupa angka')
  ],
}