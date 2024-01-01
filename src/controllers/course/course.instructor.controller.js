const db = require('../../../prisma/connection'),
    utils = require('../../utils/utils'),
    imageKitFile = require('../../utils/imageKitFile')

module.exports = {
    read: async (req, res) => {
        try {
            const data = await db.courseInstructor.findMany()
            return res.status(200).json(utils.apiSuccess("Berhasil mengambil semua data instructor", data))

        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    readById: async (req, res) => {
        const { id } = req.params
         
        try {
            const instructor = await db.courseInstructor.findUnique({
                where: { 
                    id: parseInt(id)
                }
            })
            if (!instructor) {
                return res.status(404).json(utils.apiError("Instructor not found"))
            }
            return res.status(200).json(utils.apiSuccess("Berhasil mengambil data instructor berdasarkan id", instructor))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, password } = req.body;
    
            const instructor = await db.courseInstructor.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
    
            if (!instructor) {
                return res.status(404).json(utils.apiError("Instruktur tidak ditemukan"));
            }

            if (email && email !== instructor.email) {
                const checkEmail = await db.courseInstructor.findUnique({
                    where: {
                        email: email
                    }
                });
    
                if (checkEmail) {
                    return res.status(409).json(utils.apiError("Email telah terdaftar"));
                }
            }
    
            let photoProfileUrl = instructor.photoProfile;
            let imageFilename = instructor.imageFilename;
            if (req.file) {
                const allowedMimes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
                const allowedSizeMb = 2;
                const photoInstructor = req.file;
    
                if (!allowedMimes.includes(photoInstructor.mimetype)) {
                    return res.status(409).json(utils.apiError("Format gambar tidak diperbolehkan"));
                }
    
                if (photoInstructor.size / (1024 * 1024) > allowedSizeMb) {
                    return res.status(409).json(utils.apiError("Gambar kategori tidak boleh lebih dari 2mb"));
                }
    
                const uploadFile = await imageKitFile.upload(photoInstructor);
    
                if (!uploadFile) {
                    return res.status(500).json(utils.apiError("Kesalahan pada internal server"));
                }
    
                photoProfileUrl = uploadFile.url;
                imageFilename = uploadFile.name;
            }
    
            let hashPassword = instructor.password;
            if (password) {
                hashPassword = await utils.createHashData(password);
            }
    
            const updatedInstructor = await db.courseInstructor.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name: name || instructor.name,
                    email: email || instructor.email,
                    password: hashPassword,
                    photoProfile: photoProfileUrl,
                    imageFilename: imageFilename
                }
            });
    
            const data = {
                name: updatedInstructor.name,
                email: updatedInstructor.email,
                photoProfile: updatedInstructor.photoProfile
            };
    
            return res.status(200).json(utils.apiSuccess("Data instruktur berhasil diperbarui", data));
        } catch (error) {
            console.log(error);
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"));
        }
    },

    delete: async (req, res) => {
        const { id } = req.params
         
        try {
            await db.courseInstructor.delete({
                where: {
                    id: parseInt(id) 
                }
            })
            return res.status(200).json(utils.apiSuccess("Berhasil hapus data Instructor"))
        } catch (error) {
            console.log(error)
            return res.status(500).json(utils.apiError("Kesalahan pada internal server"))
        }
    }
}
