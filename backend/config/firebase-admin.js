// const admin = require('firebase-admin');
// const serviceAccount = require('./firebaseServiceAccountKey.json');

// // Tránh lỗi khi khởi tạo lại app nhiều lần
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// module.exports = admin;


const admin = require("firebase-admin");

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;