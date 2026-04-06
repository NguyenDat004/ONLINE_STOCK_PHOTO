const authService = require("../services/authService");

exports.login = async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Verify Firebase token
    const decoded = await authService.verifyFirebaseToken(token);
    const { uid, email, name } = decoded;

    // 2. Check user in PostgreSQL
    const existingUser = await authService.findUserByUid(uid);

    // 3. Nếu chưa có → tạo mới
    if (!existingUser) {
      await authService.createUser({ uid, email, name });
      console.log("User mới đã được lưu vào PostgreSQL");
    }

    res.status(200).json({
      message: "Đăng nhập thành công",
      user: { uid, email }
    });

  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Token không hợp lệ" });
  }
};