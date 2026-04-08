# 📸 Online Stock Photo Ecommerce Website

A full-stack web application that allows photographers to upload, sell and manage stock photos while customers can browse, purchase and download high-quality images.

---

## 🔗 Live Demo

| Service | Link |
|---|---|
| 🌐 Frontend | https://stock-photo-online.vercel.app |
| ⚙️ Backend API | https://stock-photo-api.onrender.com/ |

---

## ✨ Main Features

### 👤 Authentication
- Register / Login with Firebase Authentication
- Google Login
- JWT verification on backend
- Auto create user in PostgreSQL when login

### 🖼 Photo Marketplace
- Browse all photos
- Search photos by keyword
- Filter by category
- Pagination
- Photo detail page
- Upload photos (Cloudinary storage)

### 🛒 Ecommerce System
- Add to cart
- Checkout page
- VNPay payment integration (Sandbox)
- Download purchased photos
- Transaction history

### ⭐ Reviews & Ratings
- Rate photos
- Comment system

### 🛠 Admin Dashboard
- Manage users
- Moderate uploaded photos
- Approve / edit / delete photos
- Manage photo categories

---

## 🛠 Tech Stack

### Frontend
- ReactJS (Create React App)
- React Router
- Bootstrap
- Axios
- Firebase Authentication

### Backend
- NodeJS + ExpressJS
- PostgreSQL (Main Database)
- Firebase Admin SDK (Token verification)
- Cloudinary (Image Storage)
- VNPay Sandbox (Payment Gateway)

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → PostgreSQL Cloud

---

## 🏗 System Architecture
React Client
↓
Firebase Authentication
↓ (JWT Token)
Express Backend API
↓
PostgreSQL Database
↘
Cloudinary (Image Storage)
### Architecture Overview

React Client (Vercel)  
        │  
        │ Firebase Authentication (JWT Token)  
        ▼  
Express Backend API (Render)  
        │  
        ├── PostgreSQL → Users / Photos / Orders / Transactions  
        └── Cloudinary → Image Storage  

---

## 📂 Project Structure

ONLINE_STOCK_PHOTO
│
├── client/                     # React Frontend
│   ├── src/
│   │   ├── pages/              # Home, Login, Register, Upload, Admin...
│   │   ├── components/         # Navbar, Footer, Cards...
│   │   ├── api/                # Axios API calls
│   │   ├── context/            # Auth & Cart global state
│   │   └── firebase.js         # Firebase configuration
│   │
│   └── package.json
│
├── server/                     # NodeJS Backend
│   ├── routes/                 # API routes
│   ├── controllers/            # Business logic
│   ├── middleware/             # Firebase auth middleware
│   ├── config/                 # Cloudinary & DB config
│   └── index.js
│
└── README.md

---

## ⚙️ Run Project Locally

### 1️⃣ Clone repository

git clone https://github.com/NguyenDat004/ONLINE_STOCK_PHOTO.git  
cd ONLINE_STOCK_PHOTO

---

## ▶️ Run Frontend

cd client  
npm install  
npm start  

Frontend runs at:  
http://localhost:3000

---

## ▶️ Run Backend

cd server  
npm install  
npm run dev  

Backend runs at:  
http://localhost:5000

---

## 🔐 Environment Variables (Backend)

Create `.env` inside **server/** folder:

PORT=5000

DATABASE_URL=your_postgresql_connection

# Firebase Admin
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# VNPay
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:5000/api/vnpay/return

---

## 💳 VNPay Sandbox Test Card

Bank: NCB  
Card Number: 9704198526191432198  
Name: NGUYEN VAN A  
Expiry Date: 07/15  
OTP: 123456  

---

## 🚀 Future Improvements

- Email notifications after purchase  
- Watermark preview before download  
- Subscription plans for buyers  
- Admin analytics dashboard  
- Docker deployment  

---

## 👨‍💻 Author

Nguyen Dat  
Graduation Thesis Project – 2025

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub!