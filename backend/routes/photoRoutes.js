const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", photoController.getAllPhotos);
router.get("/all-admin", photoController.getAllPhotosAdmin);
router.get("/:id", photoController.getPhotoById);
router.delete("/:id", photoController.deletePhoto);
router.put("/:id/approve", photoController.approvePhoto);
router.post("/upload", upload.single("image"), photoController.uploadPhoto);
router.get("/:id/download", authMiddleware, photoController.downloadPhoto);
router.get("/check-status/:photoId/:userId", photoController.checkStatus);
router.post("/cart/add", photoController.addToCart);


module.exports = router;