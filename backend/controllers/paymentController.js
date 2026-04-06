const paymentService = require("../services/paymentService");

// CREATE PAYMENT
exports.createPayment = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { selectedPhotoIds } = req.body;

    const paymentUrl = await paymentService.createPaymentService(
      req,
      userId,
      selectedPhotoIds
    );

    res.json({ paymentUrl });
  } catch (err) {
    if (err.message === "CART_EMPTY")
      return res.status(400).json({ message: "Giỏ hàng rỗng" });

    console.error(err);
    res.status(500).json({ message: "Lỗi tạo thanh toán" });
  }
};

// HANDLE VNPAY RETURN
exports.vnpayReturn = async (req, res) => {
    try {
      const result = await paymentService.handleVnpayReturnService(req.query);
      res.redirect("http://localhost:3000" + result.redirect);
    } catch (err) {
      res.redirect("http://localhost:3000/payment-failed?error=server_error");
    }
  };
  