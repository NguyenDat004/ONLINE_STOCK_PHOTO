
// 🛒 Controller xử lý các yêu cầu liên quan đến giỏ hàng
const cartService = require("../services/cartService");

// 🛒 Thêm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { userId, photoId, quantity = 1 } = req.body;

    await cartService.addToCartService(userId, photoId, quantity);

    res.json({ message: "✔️ Đã thêm vào giỏ hàng" });
  } catch (err) {
    if (err.message === "ALREADY_PURCHASED")
      return res.status(400).json({
        message: "Bạn đã mua ảnh này rồi!",
      });

    if (err.message === "ALREADY_IN_CART")
      return res.status(400).json({
        message: "Ảnh đã có trong giỏ hàng!",
      });

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📋 Lấy giỏ hàng
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await cartService.getCartService(userId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ Xóa item khỏi cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, photoId } = req.params;

    await cartService.removeFromCartService(userId, photoId);

    res.json({ message: "Đã xoá khỏi giỏ hàng" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔄 Update quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { userId, photoId } = req.params;
    const { quantity } = req.body;

    await cartService.updateQuantityService(userId, photoId, quantity);

    res.json({ message: "Đã cập nhật số lượng" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧹 Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await cartService.clearCartService(userId);

    res.json({ message: "Đã xoá toàn bộ giỏ hàng" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};