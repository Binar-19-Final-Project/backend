const db = require("../../../prisma/connection"),
  utils = require("../../utils/utils"),
  imageKitFile = require('../../utils/imageKitFile')

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

      const photoCategory = req.file;
      const allowedMimes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      const allowedSizeMb = 2;

      if(typeof photoCategory === 'undefined') return res.status(422).json(utils.apiError("Gambar kategori tidak boleh kosong"))

      if(!allowedMimes.includes(photoCategory.mimetype)) return res.status(409).json(utils.apiError("Format gambar tidak diperbolehkan"))

      if((photoCategory.size / (1024*1024)) > allowedSizeMb) return res.status(409).json(utils.apiError("Gambar kategori tidak boleh lebih dari 2mb"))

      const uploadFile = await imageKitFile.upload(photoCategory)

      if(!uploadFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

      const { name, isPublished } = req.body;

      console.log('===============================', isPublished)

      const nameSlug = await utils.createSlug(name);

      const isPublishedBool = isPublished === 'true'
      
      await db.courseCategory.create({
        data: {
          name: name,
          slug: nameSlug,
          isPublished: isPublishedBool,
          urlPhoto: uploadFile.url,
          imageFileName: uploadFile.name
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Berhasil Menambah Kategori"));

    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(utils.apiError("Kesalahan pada Internal Server"));
    }
  },

  update: async (req, res) => {
    try {
     
      const id = parseInt(req.params.id);

      const checkCategory = await db.courseCategory.findUnique({
        where: {
          id: id,
        },
      });

      if (!checkCategory)
        return res
          .status(404)
          .json(utils.apiError("Kategori Tidak di temukan"));

      const photoCategory = req.file
      const allowedMimes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'image/webp'
      ]
      const allowedSizeMb = 2

      let imageUrl = null;
      let imageFileName = null;

      if(typeof photoCategory === 'undefined') {

          imageUrl = checkCategory.imageUrl
          imageFileName = checkCategory.imageFileName

      }else{

          if(!allowedMimes.includes(photoCategory.mimetype)) return res.status(409).json(utils.apiError("Format gambar tidak diperbolehkan"))

          if((photoCategory.size / (1024*1024)) > allowedSizeMb) return res.status(409).json(utils.apiError("Gambar kelas tidak boleh lebih dari 2mb"))

          if(checkCategory.imageFileName != null) {
              const deleteFile = await imageKitFile.delete(checkCategory.imageFileName)
              if(!deleteFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
          }

          const uploadFile = await imageKitFile.upload(photoCategory)

          if(!uploadFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

          imageUrl = uploadFile.url
          imageFileName = uploadFile.name
      }

      const { name, isPublished } = req.body;

      const checkName = await db.courseCategory.findFirst({
          where: {
              name: name,
              NOT: {
                  id: id
              }
          }
      })

      if(checkName) return res.status(409).json(utils.apiError("Nama kategori sudah terdaftar"))

      const nameSlug = await utils.createSlug(name);

      await db.courseCategory.update({
        where: {
          id: id,                     
        },
        data: {
          name: name,
          slug: nameSlug,
          isPublished: Boolean(isPublished),
          urlPhoto: imageUrl,
          imageFileName: imageFileName
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Berhasil mengubah kategori"));
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

      const deleteFile = await imageKitFile.delete(check.imageFileName)
      if(!deleteFile) return res.status(500).json(utils.apiError("Kesalahan pada internal server"))

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
