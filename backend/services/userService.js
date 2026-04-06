// Service xử lý logic liên quan đến user, tương tác trực tiếp với Cloudinary và database
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const pool = require("../config/db");

// config cloudinary 1 lần duy nhất
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.uploadAvatarToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "avatars",
  });

  fs.unlinkSync(filePath);
  return result.secure_url;
};

exports.updateUserAvatar = async (uid, avatarUrl) => {
  await pool.query(
    "UPDATE users SET avatar_url=$1 WHERE uid=$2",
    [avatarUrl, uid]
  );
};