const db = require("../../../prisma/connection"),
  utils = require("../../utils/utils"),
  imageKit = require("../../utils/imageKit");

module.exports = {
  getAll: async (req, res) => {
    try {
      const category = await db.courseCategory.findMany();

      return res
        .status(200)
        .json(
          utils.apiSuccess("Berhasil Menampilkan Semua Data Kategori", category)
        );
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(utils.apiError("Kesalahan pada Internal Server"));
    }
  },
  getById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const category = await db.courseCategory.findUnique({
        where: {
          id: id,
        },
        include: {
          course: true,
        },
      });
      if (!category) {
        return res
          .status(404)
          .json(utils.apiError("Kategori tidak di temukan"));
      }
      return res
        .status(200)
        .json(
          utils.apiSuccess(
            "Berhasil mengambil data kategori berdasarkan id",
            category
          )
        );
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(utils.apiError("Kesalahan pada Internal Server "));
    }
  },
  create: async (req, res) => {
    try {
      const { name, urlPhoto, isPublished } = req.body;
      const photoCategory = req.file;
      console.log("test", req.body);
      const allowedMimes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!name) {
        return res.status(400).json(utils.apiError("Nama Kosong1"));
      }
      const allowedSizeMb = 2;
      const nameSlug = await utils.createSlug(name);
      if (typeof photoCategory === "undefined")
        return res
          .status(400)
          .json(utils.apiError("Foto cover kategori tidak boleh kosong"));
      if (!allowedMimes.includes(photoCategory.mimetype))
        return res
          .status(400)
          .json(utils.apiError("cover kategori harus berupa gambar"));
      if (photoCategory.size / (1024 * 1024) > allowedSizeMb)
        return res
          .status(400)
          .json(utils.apiError("cover categori tidak boleh lebih dari 2mb"));
      const stringFile = photoCategory.buffer.toString("base64");
      const originalFileName = photoCategory.originalname;
      const uploadFile = await imageKit.upload({
        fileName: originalFileName,
        file: stringFile,
      });
      const data = await db.courseCategory.create({
        data: {
          name: name,
          slug: nameSlug,
          isPublished: Boolean(isPublished),
          urlPhoto: uploadFile.url,
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Berhasil Menambah Kategori", data));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(utils.apiError("Kesalahan pada Internal Server"));
    }
  },
  update: async (req, res) => {
    try {
      const { name, urlPhoto, isPublished } = req.body;
      const nameSlug = await utils.createSlug(name);
      const id = parseInt(req.params.id);
      
      const photoCategory = req.file;
      console.log(req.file, "gagal");
      const allowedMimes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      const check = await db.courseCategory.findUnique({
        where: {
          id: id,
        },
      });

      if (!check)
        return res
          .status(404)
          .json(utils.apiError("Kategori Tidak di temukan"));
      const allowedSizeMb = 2;
      if (typeof photoCategory === "undefined")
        return res
          .status(400)
          .json(utils.apiError("Foto cover kategori tidak boleh kosong"));
      if (!allowedMimes.includes(photoCategory.mimetype))
        return res
          .status(400)
          .json(utils.apiError("cover kategori harus berupa gambar"));
      if (photoCategory.size / (1024 * 1024) > allowedSizeMb)
        return res
          .status(400)
          .json(utils.apiError("cover categori tidak boleh lebih dari 2mb"));
      const stringFile = photoCategory.buffer.toString("base64");
      const originalFileName = photoCategory.originalname;
      const uploadFile = await imageKit.upload({
        fileName: originalFileName,
        file: stringFile,
      });
      const category = await db.courseCategory.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          slug: nameSlug,
          isPublished: Boolean(isPublished),
          urlPhoto: uploadFile.url,
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Berhasil mengubah kategori", category));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(utils.apiError("Kesalahan pada Internal Server"));
    }
  },
  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const check = await db.courseCategory.findUnique({
        where: {
          id: id,
        },
      });

      if (!check)
        return res
          .status(404)
          .json(utils.apiError("Kategori tidak di temukan"));

      await db.courseCategory.delete({
        where: {
          id: id,
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Berhasil menghapus kategori"));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(utils.apiError("Kesalahan pada Internal Server"));
    }
  },
};
