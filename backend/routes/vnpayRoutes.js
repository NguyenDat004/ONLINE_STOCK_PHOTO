const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create-payment", authMiddleware, paymentController.createPayment);
router.get("/return", paymentController.vnpayReturn);

module.exports = router;