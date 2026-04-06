const userService = require("../services/userService");

exports.updateAvatar = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Không có file upload"
      });
    }

    // upload ảnh
    const avatarUrl = await userService.uploadAvatarToCloudinary(
      req.file.path
    );

    // lưu DB
    await userService.updateUserAvatar(uid, avatarUrl);

    res.json({ avatar: avatarUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};