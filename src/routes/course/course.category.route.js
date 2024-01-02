const express = require("express"),
  schema = require("../../validation/course.schema"),
  validate = require("../../middlewares/validation"),
  controller = require("../../controllers/course"),
  multer = require("multer")(),
  checkRole = require('../../middlewares/check.role'),
  { verifyToken } = require('../../middlewares/verify.token'),
  router = express.Router()

router.get("/", controller.courseCategory.getAll)
router.get("/:id", controller.courseCategory.getById)
router.post("/", multer.single("photoCategory"), verifyToken, checkRole('admin'), validate(schema.category), controller.courseCategory.create)
router.put("/:id", multer.single("photoCategory"), verifyToken, checkRole('admin'), validate(schema.category), controller.courseCategory.update)
router.delete("/:id", verifyToken, checkRole('admin'), controller.courseCategory.delete)

module.exports = router
