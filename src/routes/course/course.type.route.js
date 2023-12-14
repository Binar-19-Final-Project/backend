const express = require("express"),
  controller = require("../../controllers/course"),
  { verifyToken } = require('../../middlewares/verify.token'),
  checkRole = require('../../middlewares/check.role'),
  router = express.Router();

router.get("/", controller.courseType.getAll);
router.get("/:id", controller.courseType.getById);

router.post("/", controller.courseType.create);
router.put("/:id", controller.courseType.update);
router.delete("/:id", controller.courseType.delete);

module.exports = router;
