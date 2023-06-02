const express = require("express");
const { wrap } = require("async-middleware");
const invoicesController = require("../controllers/invoices");
const auth = require("./middlewares/auth");
const router = express.Router();
const checkUser = require("./middlewares/checkUser");

router.post(
    "/create",
    auth("user"),
    wrap(async (req, res) => {
        const { id: userId } = req.user;
        const { id, total_price } = req.body;

        const { status, confirmation, paid } = await invoicesController.createInvoice({
            user_id: userId,
            order: { id, total_price },
        });

        res.send({ success: true, status, confirmation, paid });
    })
);

module.exports = router;
