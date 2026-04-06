// Service xử lý logic liên quan đến authentication, tương tác trực tiếp với Firebase và database
const admin = require("../config/firebase");
const pool = require("../config/db");

exports.verifyFirebaseToken = async (token) => {
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded;
};

exports.findUserByUid = async (uid) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE uid=$1",
    [uid]
  );
  return result.rows[0];
};

exports.createUser = async ({ uid, email, name }) => {
  await pool.query(
    "INSERT INTO users (uid, email, name) VALUES ($1,$2,$3)",
    [uid, email, name || ""]
  );
};