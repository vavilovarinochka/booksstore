const productsController = require("../controllers/products");
const express = require("express")
const router = express.Router()
const { sign: signToken } = require("../utils/token");
const { wrap } = require("async-middleware");
const auth = require("./middlewares/auth");
const upload = require("../utils/multer-config");


router.post(
    "/create",
    // auth("admin"),
    wrap(async (req, res) => {
        const { title, author, amount, price, photo_id } = req.body;
        const { productId } = await productsController.createProduct({
            title, author, amount, price, photo_id
        });
        res.send({
            success: true,
            productId,
            message: 'Товар был успешно создан'
        });
    })
);

router.post(
    "/update/:id",
    auth("admin"),
    wrap(async (req, res) => {
        const { title, author, amount, price, photo_id } = req.body;
        await productsController.updateProduct({
            productId: req.params.id,
            title, author, amount, price, photo_id
        });

        res.send({
            success: true,
            message: "Данные товара были изменены"
        });
    })
);

router.post(
    "/del",
    auth("admin"),
    wrap(async (req, res) => {
        const { productId } = req.body;
        await productsController.deleteProduct({ productId });

        res.send({
            success: true,
            message: 'Товар был успешно удалён'
        });
    })
);

router.get(
    "/one/:id",
    // auth("user"),
    wrap(async (req, res) => {
        const { id: productId } = req.params;
        const { id, title, author, amount, price, photo_id } = await productsController.getProductById({ productId });

        res.send({
            success: true,
            product: { id, title, author, amount, price, photo_id },
        });
    })
);

router.get(
    "/havingId",
    // auth("admin"),
    wrap(async (req, res) => {
        const { productList } = req.query;
        const products = await productsController.getProductHavingId({ productId: productList.split(',') });
        res.send({ success: true, products });
    })
);

router.get(
    "/list",
    // auth("admin"),
    wrap(async (req, res) => {
        const { limit, offset } = req.params;
        const products = await productsController.getProductsList({
            limit: +limit || 10,
            offset: +offset || 0,
        });

        res.send({
            success: true,
            products,
            limit,
            offset,
        });
    })
);

module.exports = router;
