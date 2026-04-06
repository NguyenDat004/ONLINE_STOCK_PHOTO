// Service xử lý logic liên quan đến ảnh, tương tác trực tiếp với database
const pool = require("../config/db");

// Lấy tất cả ảnh đã duyệt, kèm tên category, sắp xếp mới nhất trước
exports.getAllPhotos = async () => {
  const result = await pool.query(`
    SELECT photos.*, categories.category_name AS category
    FROM photos
    LEFT JOIN categories ON photos.category_id = categories.category_id
    WHERE photos.status = 'Đã duyệt'
    ORDER BY photos.created_at DESC
  `);
  return result.rows;
};

// Lấy chi tiết ảnh theo ID, kèm tên category
exports.getPhotoById = async (id) => {
  const result = await pool.query(
    `SELECT photos.*, categories.category_name AS category
     FROM photos
     LEFT JOIN categories ON photos.category_id = categories.category_id
     WHERE photos.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Lấy tất cả ảnh (dành cho admin), kèm tên category và số lượng đã bán, sắp xếp mới nhất trước
exports.getAllPhotosAdmin = async () => {
  const result = await pool.query(`
    SELECT 
      p.id, p.title, p.description, p.price,
      p.image_url, p.uploader, p.status,
      p.created_at, p.category_id,
      c.category_name as category,
      COALESCE(COUNT(ti.id), 0) as sold
    FROM photos p
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN transaction_items ti ON p.id = ti.photo_id
    GROUP BY p.id, c.category_name
    ORDER BY p.created_at DESC
  `);

  return result.rows;
};

// Xóa ảnh theo ID
exports.deletePhoto = async (id) => {
  const result = await pool.query(
    "DELETE FROM photos WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

// Duyệt ảnh theo ID (cập nhật status thành 'Đã duyệt')
exports.approvePhoto = async (id) => {
  const result = await pool.query(
    `UPDATE photos SET status='Đã duyệt' WHERE id=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

// 🔍 Lấy URL download ảnh gốc, chỉ trả về nếu đã mua
exports.getDownloadUrlService = async (photoId, userUid) => {
  // check đã mua chưa
  const purchased = await pool.query(
    `SELECT 1 FROM transaction_items 
       WHERE user_id = $1 AND photo_id = $2 
       LIMIT 1`,
    [userUid, photoId]
  );

  if (purchased.rowCount === 0) throw new Error("NOT_PURCHASED");

  const photoRes = await pool.query(
    `SELECT image_original_url FROM photos WHERE id=$1`,
    [photoId]
  );

  if (photoRes.rows.length === 0) throw new Error("NOT_FOUND");

  return photoRes.rows[0].image_original_url;
};

// 🔍 Check status ảnh (đã mua / trong giỏ)
exports.checkPhotoStatusService = async (photoId, userId) => {
  const purchased = await pool.query(
    `SELECT 1 FROM transaction_items 
       WHERE user_id=$1 AND photo_id=$2 LIMIT 1`,
    [userId, photoId]
  );

  const inCart = await pool.query(
    `SELECT 1 FROM carts 
       WHERE user_id=$1 AND photo_id=$2 LIMIT 1`,
    [userId, photoId]
  );

  return {
    isPurchased: purchased.rowCount > 0,
    isInCart: inCart.rowCount > 0,
    canAddToCart: purchased.rowCount === 0 && inCart.rowCount === 0,
  };
};
