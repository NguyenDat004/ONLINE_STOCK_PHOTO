const admin = require("firebase-admin");

let serviceAccount;

if (process.env.NODE_ENV === "production") {
  // deploy trên Render: lấy từ env
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };
} else {
  // local: dùng file JSON
  serviceAccount = require("./firebaseServiceAccountKey.json");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;