
// 🛒 Định nghĩa các route liên quan đến giỏ hàng
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");


// 🛒 Thêm vào giỏ
router.post("/add", cartController.addToCart);

// 📋 Lấy giỏ hàng của user
router.get("/:userId", cartController.getCart);

// 🗑️ Xoá 1 item khỏi giỏ
router.delete("/:userId/:photoId", cartController.removeFromCart);

// 🔄 Update số lượng
router.put("/:userId/:photoId", cartController.updateQuantity);

// 🧹 Clear cart sau khi checkout
router.delete("/clear/:userId", cartController.clearCart);

module.exports = router;