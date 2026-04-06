const pool = require("../config/db");
const moment = require("moment");
const qs = require("qs");
const {
  getIpAddress,
  sortObject,
  createSecureHash,
} = require("../utils/vnpayUtil");

// ================= CREATE PAYMENT URL =================
exports.createPaymentService = async (req, userId, selectedPhotoIds) => {
  const ipAddr = getIpAddress(req);
  const date = moment().format("YYYYMMDDHHmmss");

  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURN_URL;

  let cartQuery;
  let queryParams;

  if (selectedPhotoIds?.length > 0) {
    cartQuery = `
      SELECT carts.photo_id, photos.price
      FROM carts
      JOIN photos ON carts.photo_id = photos.id
      WHERE carts.user_id = $1 AND carts.photo_id = ANY($2)
    `;
    queryParams = [userId, selectedPhotoIds];
  } else {
    cartQuery = `
      SELECT carts.photo_id, photos.price
      FROM carts
      JOIN photos ON carts.photo_id = photos.id
      WHERE carts.user_id = $1
    `;
    queryParams = [userId];
  }

  const cart = await pool.query(cartQuery, queryParams);
  if (cart.rows.length === 0) throw new Error("CART_EMPTY");

  const totalAmount = cart.rows.reduce((s, i) => s + Number(i.price), 0);

  const orderData = {
    userId,
    selectedPhotoIds: cart.rows.map((i) => i.photo_id),
  };
  const orderInfo = Buffer.from(JSON.stringify(orderData)).toString("base64");

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: date,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "billpayment",
    vnp_Amount: totalAmount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: date,
  };

  vnp_Params = sortObject(vnp_Params);
  vnp_Params["vnp_SecureHash"] = createSecureHash(vnp_Params, secretKey);

  return vnpUrl + "?" + qs.stringify(vnp_Params, { encode: true });
};

const { verifyVnpSignature } = require("../utils/vnpayUtil");

// ======================================================
// HANDLE VNPAY RETURN
// ======================================================
exports.handleVnpayReturnService = async (query) => {
  // 1️⃣ Verify signature
  if (!verifyVnpSignature(query))
    return { redirect: "/payment-failed?error=invalid_signature" };

  // 2️⃣ Check response code
  if (query.vnp_ResponseCode !== "00")
    return { redirect: `/payment-failed?code=${query.vnp_ResponseCode}` };

  // 3️⃣ Decode orderInfo
  const orderData = JSON.parse(
    Buffer.from(query.vnp_OrderInfo, "base64").toString()
  );
  const userId = orderData.userId;
  const selectedPhotoIds = orderData.selectedPhotoIds;

  // 4️⃣ Check user tồn tại
  const userCheck = await pool.query(
    `SELECT uid FROM users WHERE uid=$1`,
    [userId]
  );
  if (userCheck.rows.length === 0)
    return { redirect: "/payment-failed?error=user_not_found" };

  // 5️⃣ Lấy cart items đã thanh toán
  const cart = await pool.query(
    `SELECT carts.photo_id, photos.price
     FROM carts
     JOIN photos ON carts.photo_id = photos.id
     WHERE carts.user_id=$1 AND carts.photo_id = ANY($2)`,
    [userId, selectedPhotoIds]
  );
  if (cart.rows.length === 0)
    return { redirect: "/payment-failed?error=empty_cart" };

  const totalAmount = cart.rows.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  // 6️⃣ Tạo transaction
  const tran = await pool.query(
    `INSERT INTO transactions (user_id,total_price,status,total_items)
     VALUES ($1,$2,'success',$3)
     RETURNING transaction_id`,
    [userId, totalAmount, cart.rows.length]
  );
  const transactionId = tran.rows[0].transaction_id;

  // 7️⃣ Transaction items + wallet seller
  for (const item of cart.rows) {
    const photo = await pool.query(
      `SELECT price,uploader_id FROM photos WHERE id=$1`,
      [item.photo_id]
    );

    const price = Number(photo.rows[0].price);
    const sellerId = photo.rows[0].uploader_id;
    const sellerEarn = price * 0.8;

    await pool.query(
      `INSERT INTO transaction_items
      (transaction_id,photo_id,price,user_id,seller_id,seller_earn)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [transactionId, item.photo_id, price, userId, sellerId, sellerEarn]
    );

    // tạo wallet nếu chưa có
    await pool.query(
      `INSERT INTO wallets (user_id,balance,total_earned)
       VALUES ($1,0,0)
       ON CONFLICT (user_id) DO NOTHING`,
      [sellerId]
    );

    await pool.query(
      `UPDATE wallets
       SET balance=balance+$1,
           total_earned=total_earned+$1
       WHERE user_id=$2`,
      [sellerEarn, sellerId]
    );

    await pool.query(
      `INSERT INTO wallet_transactions
       (user_id,amount,transaction_type,description)
       VALUES ($1,$2,'earn',$3)`,
      [sellerId, sellerEarn, `Thu nhập bán ảnh ${item.photo_id}`]
    );
  }

  // 8️⃣ Clear cart
  await pool.query(
    "DELETE FROM carts WHERE user_id=$1 AND photo_id = ANY($2)",
    [userId, selectedPhotoIds]
  );

  return {
    redirect: `/payment-success?transaction_id=${transactionId}&amount=${query.vnp_Amount}`,
  };
};