📸 Online Stock Photo Ecommerce Website
A full-stack web application that allows photographers to upload, sell and manage stock photos while customers can browse, purchase and download high-quality images.

🔗 Frontend: https://stock-photo-online.vercel.app/
🔗 Backend API: https://stock-photo-api.onrender.com/

🧑‍💻 Tech Stack
Frontend
ReactJS (Create React App)

React Router

Bootstrap

Axios

Firebase Authentication

Backend
NodeJS + ExpressJS

PostgreSQL (main database)

Cloudinary (image storage)

Firebase Admin SDK (auth verification)

VNPay Sandbox (payment)

Deployment
Frontend → Vercel

Backend → Render

Database → PostgreSQL Cloud

✨ Main Features
👤 Authentication
Register / Login with Firebase

Google Login

JWT Token verification on backend

Auto create user in PostgreSQL after login

🖼 Photo Marketplace
Users can:

Browse photos

Search & filter by category

View photo details

Add to cart

Purchase photos

Download after payment

Photographers can:

Upload photos

Manage uploaded photos

View sales

Admin can:

Manage users

Approve / delete photos

Manage categories

View transactions

🛒 Shopping Cart & Checkout
Add / remove photos from cart

Checkout multiple photos

Order history saved in database

💳 VNPay Payment Integration
Create payment URL from backend

Redirect to VNPay Sandbox

Verify return URL signature

Save successful transactions

☁️ Cloudinary Upload
Images are uploaded to Cloudinary and only URLs are stored in PostgreSQL.

🗄 Database Design
Main tables:

users

photos

categories

cart

transactions

reviews

⚙️ Environment Variables
Backend (.env)
PORT=5000
DATABASE_URL=your_postgres_url

FIREBASE_PROJECT_ID=xxx
FIREBASE_PRIVATE_KEY=xxx
FIREBASE_CLIENT_EMAIL=xxx

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

VNP_TMN_CODE=xxx
VNP_HASH_SECRET=xxx
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=https://stock-photo-api.onrender.com/api/vnpay/return
Frontend (.env)
REACT_APP_API_URL=https://stock-photo-api.onrender.com/api
🚀 Run Locally
1️⃣ Clone project
git clone https://github.com/NguyenDat004/ONLINE_STOCK_PHOTO.git
cd ONLINE_STOCK_PHOTO
2️⃣ Run Backend
cd backend
npm install
npm start
Server runs at:

http://localhost:5000
3️⃣ Run Frontend
cd frontend
npm install
npm start
App runs at:

http://localhost:3000
📌 API Endpoints Overview
Auth
POST /api/auth/login
GET  /api/users/:email
Photos
GET    /api/photos
GET    /api/photos/:id
POST   /api/photos/upload
DELETE /api/photos/:id
Categories
GET /api/categories
Cart
GET    /api/cart/:userId
POST   /api/cart/add
DELETE /api/cart/remove
Payment
POST /api/vnpay/create-payment
GET  /api/vnpay/return
📷 Screenshots (Add later)
You can add screenshots here for:

Home page

Photo detail

Admin dashboard

Payment page

🎯 Project Purpose
This project was built as a graduation thesis and portfolio project to demonstrate full-stack development skills including:

REST API design

Authentication & authorization

Payment integration

Cloud storage

Deployment pipeline

👨‍🎓 Author
Nguyen Dat
Fullstack Developer (Fresher/Intern)