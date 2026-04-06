// Service xử lý logic liên quan đến upload ảnh, tương tác trực tiếp với Cloudinary và database
const cloudinary = require("../config/cloudinary");
const pool = require("../config/db");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

exports.uploadPhotoService = async (file, body) => {
  const localPath = file.path;

  try {
    // 1️⃣ Upload ảnh gốc
    const originalUpload = await cloudinary.uploader.upload(localPath, {
      folder: "photo_stock/original",
    });

    // 2️⃣ Resize + watermark
    const img = await Jimp.read(localPath);

    if (img.getWidth() > 1280) img.resize(1280, Jimp.AUTO);
    img.quality(70);

    const watermarkPath = path.join(__dirname, "../assets/watermark.png");
    if (fs.existsSync(watermarkPath)) {
      const watermark = await Jimp.read(watermarkPath);
      watermark.resize(img.getWidth() / 4, Jimp.AUTO);

      const x = img.getWidth() - watermark.getWidth() - 10;
      const y = img.getHeight() - watermark.getHeight() - 10;

      img.composite(watermark, x, y, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 0.6,
      });
    }

    const buffer = await img.getBufferAsync(Jimp.MIME_JPEG);

    // 3️⃣ Upload ảnh watermark
    const watermarkUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "photo_stock/watermark" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(buffer);
    });

    // 4️⃣ Xóa file local
    fs.unlinkSync(localPath);

    // 5️⃣ Lấy user từ UID
    const userRes = await pool.query(
      "SELECT id, full_name FROM users WHERE uid=$1",
      [body.uploader]
    );

    if (userRes.rows.length === 0)
      throw new Error("User không tồn tại");

    const uploaderId = userRes.rows[0].id;
    const fullName = userRes.rows[0].full_name || "Ẩn danh";

    // 6️⃣ Lưu DB
    const savedPhoto = await pool.query(
      `INSERT INTO photos 
      (title,description,uploader,uploader_id,image_url,image_original_url,category_id,price,status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        body.title || null,
        body.description || null,
        fullName,
        uploaderId,
        watermarkUpload.secure_url,
        originalUpload.secure_url,
        body.category_id || null,
        body.price || 0,
        "Chờ duyệt",
      ]
    );

    return savedPhoto.rows[0];
  } catch (err) {
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    throw err;
  }
};