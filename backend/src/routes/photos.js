const express = require("express")
const { wrap } = require("async-middleware");
const photosController = require("../controllers/photos");
const auth = require("./middlewares/auth");
const upload = require("../utils/multer-config");
const router = express.Router()

router.post(
    "/create", upload.single('file'),
    wrap(async (req, res) => {
        let files = req.file;
        console.log(files)

        // TODO: change field name in table 'photos'
        if (!files) return res.send("Ошибка при загрузке файла");
        const { photoId } = await photosController.createPhoto({ photo_path: files.filename });

        res.send({ success: true, message: "Файл загружен", id: photoId });
    })
);

router.post(
    "/update",
    auth("user"),
    wrap(async (req, res) => {
        let photo = req.file;

        await photosController.updatePhoto({
            photoId: req.params.id,
            photo_path: photo.path
        });

        res.send({ success: true });
    })
);

router.post(
    "/del/:id",
    auth("admin"),
    wrap(async (req, res) => {
        const id = req.params.id;
        await photosController.deletePhoto({ photoId: id });

        res.send({
            success: true
        });
    })
);

router.get("/one/:id",
    // auth("admin"),
    wrap(async (req, res) => {
        const id = req.params.id;
        const { id: photoId, photo_path } = await photosController.getPhotoById({ photoId: id });

        res.send({
            success: true,
            photo: { photoId, photo_path }
        });
    })
)

router.get(
    "/list",
    auth("admin"),
    wrap(async (req, res) => {
        const { limit, offset } = req.params;
        const photos = await photosController.listPhotoById({
            limit: +limit || 10,
            offset: +offset || 0,
        });

        res.send({
            success: true,
            photos,
            limit,
            offset,
        });
    })
);

module.exports = router
