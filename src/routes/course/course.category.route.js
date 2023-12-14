const express = require("express"),
  schema = require("../../validation/course.schema"),
  validate = require("../../middlewares/validation"),
  controller = require("../../controllers/course"),
  multer = require("multer")(),
  router = express.Router();

router.get("/", controller.courseCategory.getAll);
router.get("/:id", controller.courseCategory.getById);
router.post(
  "/",
  multer.single("photoCategory"),
  controller.courseCategory.create
);
router.put(
  "/:id",
  multer.single("photoCategory"),
  controller.courseCategory.update
);
router.delete("/:id", controller.courseCategory.delete);

module.exports = router;
