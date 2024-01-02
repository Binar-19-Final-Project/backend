const db = require("../../../prisma/connection"),
  utils = require("../../utils/utils");

module.exports = {
  getAll: async (req, res) => {
    try {
      const level = await db.courseLevel.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Berhasil Memampilkan data Level", level));
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan Pada Server"));
    }
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params

       

      const level = await db.courseLevel.findUnique({
        where: {
          id: parseInt(id),
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });
      if (!level) {
        return res.status(404).json(utils.apiError("level not found"));
      }
      return res
      .status(200)
      .json(utils.apiSuccess("Berhasil Memampilkan data Level", level));
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan Pada Server"));
    }
  },
  create: async (req, res) => {
    try {
      const { name } = req.body;

      const nameSlug = await utils.createSlug(name);

      const data = await db.courseLevel.create({
        data: {
          name: name,
          slug: nameSlug,
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Berhasil buat level", data));
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan Pada Server"));
    }
  },
  update: async (req, res) => {
    try {
      const { name } = req.body;
      const nameSlug = await utils.createSlug(name);
      const id = parseInt(req.params.id)
       

      const check = await db.courseLevel.findUnique({
        where: {
          id: id,
        },
      });

      if (!check) return res.status(404).json(utils.apiError("level not found"));

      const level = await db.courseLevel.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          slug: nameSlug,
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Berhasil Mengubah level", level));
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan Pada Server"));
    }
  },
  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
       

      const check = await db.courseLevel.findUnique({
        where: {
          id: id,
        },
      });

      if (!check) return res.status(404).json(utils.apiError("level not found"));

      await db.courseLevel.delete({
        where: {
          id: id,
        },
      });

      return res.status(200).json(utils.apiSuccess("Success delete level"));
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan Pada Server"));
    }
  },
};
