const express = require("express"),
  schema = require("../../validation/course.schema"),
  validate = require("../../middlewares/validation"),
  controller = require("../../controllers/course"),
  { verifyToken } = require('../../middlewares/verify.token'),
  checkRole = require('../../middlewares/check.role'),
  router = express.Router();

router.get("/", controller.courseLevel.getAll);
router.get("/:id", controller.courseLevel.getById);
router.post("/", validate(schema.level), verifyToken, checkRole('admin'), controller.courseLevel.create);
router.put("/:id", validate(schema.level), verifyToken, checkRole('admin'), controller.courseLevel.update);
router.delete("/:id", verifyToken, checkRole('admin'), controller.courseLevel.delete);

module.exports = router;
