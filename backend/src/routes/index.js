const express = require("express");
const userRouter = require("./users");
const productRouter = require("./products");
const orderRouter = require("./orders");
const invoicesRouter = require("./invoices");
const photoRouter = require("./photos");
const upload = require("../utils/multer-config");

const router = express.Router();

router.use("/users", upload.none(), userRouter);
router.use("/products", upload.none(), productRouter);
router.use("/orders", upload.none(), orderRouter);
router.use("/invoices", upload.none(), invoicesRouter);
router.use("/photos", photoRouter);

router.use((req, res) => {
    res.send({ success: false, code: "NOT_IMPLEMENTED" });
});
router.use((err, req, res, next) => {
    if (err.name === "CONTROLLER_EXCEPTION") {
        res.send({ success: false, code: err.exceptionCode, message: err.message });
    } else {
        console.error(err);
        res.send({ success: false, code: "INTERNAL_ERROR" });
    }
});

module.exports = router;
