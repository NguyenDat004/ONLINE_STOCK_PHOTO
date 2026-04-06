
// Các hàm tiện ích liên quan đến VNPAY, như tạo secure hash, lấy IP address, sắp xếp object params, v.v.
const qs = require("qs");
const crypto = require("crypto");

// Hàm lấy IP address của client (để gửi cho VNPAY)
exports.getIpAddress = (req) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "127.0.0.1";

  if (ip.includes("::ffff:")) ip = ip.replace("::ffff:", "");
  if (ip === "::1") ip = "127.0.0.1";

  return ip;
};

// Hàm sắp xếp object theo key (để tạo secure hash đúng)
exports.sortObject = (obj) => {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach((key) => (sorted[key] = obj[key]));
  return sorted;
};

// Hàm tạo secure hash từ params và secret key
exports.createSecureHash = (params, secretKey) => {
  const signData = qs.stringify(params, { encode: true });
  return crypto
    .createHmac("sha512", secretKey)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");
};

// Hàm verify vnpay signature
exports.verifyVnpSignature = (query) => {
  const secretKey = process.env.VNP_HASH_SECRET;

  let vnp_Params = { ...query };
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = exports.sortObject(vnp_Params);
  const signed = exports.createSecureHash(vnp_Params, secretKey);

  return secureHash === signed;
};
