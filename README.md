# 🍔 BKFood - Food Delivery Website

A full-stack MERN (MongoDB, Express, React, Node.js) food delivery application with admin panel, AI chatbot, and delivery integration.

## 📁 Project Structure

```
FoodDeliveryWebsite/
├── frontend/          # Customer-facing React app (port 5175)
├── admin/             # Admin panel React app (port 5174)
├── backend/           # Node.js API server (port 4000)
└── docker-compose.yml # Docker orchestration
```

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Install & Run

```bash
# Install all dependencies
npm install
npm run install-all

# Start all services
npm run all
```

Or run each separately:

```bash
# Backend (port 4000)
cd backend && npm run dev

# Frontend (port 5175)
cd frontend && npm run dev

# Admin (port 5174)
cd admin && npm run dev
```

### Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
MISTRAL_API_KEY=your_mistral_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🐳 Docker Deployment

### Run with Docker

```bash
# Build and start all containers
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop containers
docker-compose down
```

### Docker Ports

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Admin | http://localhost:8080 |
| Backend API | http://localhost:4000 |

---

## 👤 Default Admin Account

```
Email: admin@example.com
Password: admin
```

Reset admin: `cd backend && node createAdmin.js`

---

## ✨ Features

### Customer
- 🛒 Browse menu & cart
- 💳 Stripe payments
- 📍 Interactive delivery map
- 🤖 AI Chatbot
- ⭐ Order ratings
- ❤️ Wishlist

### Admin
- 📊 Dashboard analytics
- 🍕 Food management
- 📦 Order management
- 🎫 Coupons
- ⚙️ Store settings

---

## 🔧 Tech Stack

**Frontend:** React, Vite, Leaflet Maps, AOS  
**Backend:** Node.js, Express, MongoDB  
**Others:** Stripe, Mistral AI, Docker, Nginx

---

## 📝 License

MIT License
