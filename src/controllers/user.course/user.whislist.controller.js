const db = require("../../../prisma/connection"),
  utils = require("../../utils/utils");

module.exports = {
  getAll: async (req, res) => {
    try {
      const wishList = await db.UserCourseWishlist.findMany();

      return res
        .status(200)
        .json(
          utils.apiSuccess("Berhasil menampilkan semua data wishList", wishList)
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan dalam server"));
    }
  },
  getById: async (req, res) => {
    const id = parseInt(req.params.id);

    const wishList = await db.userCourseWishlist.findUnique({
      where: {
        id: id,
      },
    });
    if (!wishList) {
      return res.status(404).json(utils.apiError("Level Tidak di temukan "));
    }
    return res
      .status(200)
      .json(
        utils.apiSuccess("Berhasil menampilkan satu data wishList", wishList)
      );
  },
  create: async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      const wishList = await db.userCourseWishlist.create({
        data: {
          userId: parseInt(userId),
          courseId: parseInt(courseId),
        },
      });
      return res
        .status(200)
        .json(utils.apiSuccess("Berhasil membuat whistlist", wishList));
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan dalam server"));
    }
  },
};
