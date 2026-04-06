// Controller xử lý các API liên quan đến ảnh, gọi service để tương tác với Firestore
const photoService = require("../services/photoService");
const cartService = require("../services/cartService");

exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await photoService.getAllPhotos();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách ảnh" });
  }
};

exports.getPhotoById = async (req, res) => {
  try {
    const photo = await photoService.getPhotoById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Không tìm thấy ảnh" });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getAllPhotosAdmin = async (req, res) => {
  try {
    const photos = await photoService.getAllPhotosAdmin();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: "Lỗi admin lấy ảnh" });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await photoService.deletePhoto(req.params.id);
    res.json({ message: "Đã xóa ảnh", photo });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa ảnh" });
  }
};

exports.approvePhoto = async (req, res) => {
  try {
    const photo = await photoService.approvePhoto(req.params.id);
    res.json({ message: "Đã duyệt ảnh", photo });
  } catch (err) {
    res.status(500).json({ message: "Lỗi duyệt ảnh" });
  }
};

// Controller xử lý upload ảnh, gọi service để lưu ảnh lên Firebase Storage và metadata lên Firestore
const uploadService = require("../services/photoUploadService");

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Không có file upload" });

    const photo = await uploadService.uploadPhotoService(req.file, req.body);

    res.json({ message: "Upload thành công", photo });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Lỗi upload ảnh" });
  }
};

// 📥 Download ảnh
exports.downloadPhoto = async (req, res) => {
  try {
    const url = await photoService.getDownloadUrlService(
      req.params.id,
      req.user.uid
    );

    res.json({ download_url: url });
  } catch (err) {
    if (err.message === "NOT_PURCHASED")
      return res.status(403).json({ message: "Bạn chưa mua ảnh này" });

    if (err.message === "NOT_FOUND")
      return res.status(404).json({ message: "Không tìm thấy ảnh" });

    res.status(500).json({ error: "Lỗi server" });
  }
};

// 🔍 Check status
exports.checkStatus = async (req, res) => {
  try {
    const data = await photoService.checkPhotoStatusService(
      req.params.photoId,
      req.params.userId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 🛒 Add to cart
exports.addToCart = async (req, res) => {
  const { userId, photoId, quantity = 1 } = req.body;

  try {
    await cartService.addToCartService(userId, photoId, quantity);
    res.json({ message: "Đã thêm vào giỏ hàng!" });
  } catch (err) {
    if (err.message === "ALREADY_PURCHASED")
      return res.status(400).json({ error: "Ảnh đã mua rồi!" });

    if (err.message === "ALREADY_IN_CART")
      return res.status(400).json({ error: "Ảnh đã có trong giỏ!" });

    res.status(500).json({ error: "Lỗi server" });
  }
};
