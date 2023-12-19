const express = require("express"),
  controller = require("../../controllers/course"),
  { verifyToken } = require('../../middlewares/verify.token'),
  checkRole = require('../../middlewares/check.role'),
  router = express.Router();

router.get("/", controller.courseType.getAll);
router.get("/:id", controller.courseType.getById);

router.post("/", verifyToken, checkRole('admin'), controller.courseType.create);
router.put("/:id", verifyToken, checkRole('admin'), controller.courseType.update);
router.delete("/:id", verifyToken, checkRole('admin'), controller.courseType.delete);

module.exports = router;
