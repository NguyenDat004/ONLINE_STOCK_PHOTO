// 🛒 Service xử lý logic liên quan đến giỏ hàng
const pool = require("../config/db");


// 🛒 Thêm ảnh vào giỏ hàng
exports.addToCartService = async (userId, photoId, quantity) => {

  // 1️⃣ check đã mua chưa
  const purchased = await pool.query(
    `SELECT 1 FROM transaction_items 
     WHERE user_id=$1 AND photo_id=$2 LIMIT 1`,
    [userId, photoId]
  );

  if (purchased.rowCount > 0)
    throw new Error("ALREADY_PURCHASED");

  // 2️⃣ check đã có trong cart chưa
  const exists = await pool.query(
    `SELECT 1 FROM carts 
     WHERE user_id=$1 AND photo_id=$2 LIMIT 1`,
    [userId, photoId]
  );

  if (exists.rowCount > 0)
    throw new Error("ALREADY_IN_CART");

  // 3️⃣ thêm mới
  await pool.query(
    `INSERT INTO carts (user_id, photo_id, quantity)
     VALUES ($1,$2,$3)`,
    [userId, photoId, quantity]
  );
};



// 📋 Lấy giỏ hàng của user
exports.getCartService = async (userId) => {
  const result = await pool.query(
    `SELECT 
        c.id,
        p.id AS photo_id,
        p.title,
        p.image_url,
        p.price,
        c.quantity
     FROM carts c
     JOIN photos p ON c.photo_id = p.id
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC`,
    [userId]
  );

  return result.rows;
};



// 🗑️ Xoá item khỏi giỏ
exports.removeFromCartService = async (userId, photoId) => {
  const result = await pool.query(
    `DELETE FROM carts 
     WHERE user_id=$1 AND photo_id=$2 
     RETURNING *`,
    [userId, photoId]
  );

  if (result.rowCount === 0)
    throw new Error("NOT_FOUND");
};



// 🔄 Update số lượng
exports.updateQuantityService = async (userId, photoId, quantity) => {

  if (quantity <= 0)
    throw new Error("INVALID_QUANTITY");

  const result = await pool.query(
    `UPDATE carts 
     SET quantity=$1 
     WHERE user_id=$2 AND photo_id=$3 
     RETURNING *`,
    [quantity, userId, photoId]
  );

  if (result.rowCount === 0)
    throw new Error("NOT_FOUND");

  return result.rows[0];
};



// 🧹 Xoá toàn bộ giỏ hàng
exports.clearCartService = async (userId) => {
  await pool.query(
    `DELETE FROM carts WHERE user_id=$1`,
    [userId]
  );
};