const express = require("express"),
  schema = require("../../validation/course.schema"),
  validate = require("../../middlewares/validation"),
  controller = require("../../controllers/course"),
  router = express.Router();

router.get("/", controller.courseLevel.getAll);
router.get("/:id", controller.courseLevel.getById);
router.post("/",  controller.courseLevel.create);
router.put("/:id",  controller.courseLevel.update);
router.delete("/:id", controller.courseLevel.delete);

module.exports = router;
