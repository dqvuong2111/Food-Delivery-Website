# 🍔 BKFood - Food Delivery Website

A full-stack MERN (MongoDB, Express, React, Node.js) food delivery application with admin panel, AI chatbot, and mock delivery driver integration.

## 📁 Project Structure

```
FoodDeliveryWebsite/
├── frontend/          # Customer-facing React app (port 5175)
├── admin/             # Admin panel React app (port 5174)
├── backend/           # Node.js API server (port 4000)
├── mock-driver-api/   # Mock driver/delivery API (port 5001)
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

# Start all services (backend, frontend, admin)
npm run all

# In a separate terminal, start the mock driver API
cd mock-driver-api && npm start
```

Or run each separately:

```bash
# Backend (port 4000)
cd backend && npm run dev

# Frontend (port 5175)
cd frontend && npm run dev

# Admin (port 5174)
cd admin && npm run dev

# Mock Driver API (port 5001) - REQUIRED for delivery
cd mock-driver-api && npm start
```

---

## 🚗 Mock Driver API

The mock driver API simulates a third-party delivery service (similar to Lalamove). It runs locally and provides:

- **Delivery Quotations** - Calculate delivery fees based on distance
- **Order Creation** - Simulate driver assignment
- **Status Updates** - Manually control order status for testing
- **Webhook Sync** - Automatically updates your main backend

### Start the Mock Driver API

```bash
cd mock-driver-api
npm install   # First time only
npm start
```

### Access Points

| Service | URL |
|---------|-----|
| Mock Driver Admin | http://localhost:5001/admin |
| API Endpoints | http://localhost:5001/v3/* |

### Using the Mock Driver Admin

1. Place an order on the frontend
2. In main admin panel, process order: **Pending → Confirmed → Food Processing → Call Driver**
3. Go to http://localhost:5001/admin
4. Change order status: **Assigning → On Going → Picked Up → Completed**
5. Status changes automatically sync to your main admin panel!

### Driver Status Flow

```
ASSIGNING_DRIVER → ON_GOING → PICKED_UP → COMPLETED
                                       ↘ CANCELED (with reason)
```

---

## ⚙️ Environment Variables

Create `backend/.env`:

```env
# Database
MONGO_URI=mongodb+srv://your_connection_string

# Authentication
JWT_SECRET=your_secret_key

# Payments
STRIPE_SECRET_KEY=your_stripe_key

# AI Chatbot
MISTRAL_API_KEY=your_mistral_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Delivery API (Mock Driver)
DRIVER_API_URL=http://localhost:5001
```

---

## 🐳 Docker Deployment

### Step 1: Install Docker Desktop

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Run the installer and follow the setup wizard
3. **Restart your computer** after installation
4. Open Docker Desktop and wait until it says "Docker is running"

### Step 2: Clone the Project

```bash
git clone https://github.com/dqvuong2111/Food-Delivery-Website.git
cd Food-Delivery-Website
```

### Step 3: Configure Environment Variables

Create `backend/.env` file with your credentials.

### Step 4: Build and Run with Docker

```bash
# Build and start all containers
docker-compose up --build

# Wait until you see "Server Started on http://localhost:4000"
```

### Step 5: Access the Application

| Service | URL |
|---------|-----|
| 🌐 Frontend (Customer) | http://localhost |
| 🔧 Admin Panel | http://localhost:8080 |
| 🔌 Backend API | http://localhost:4000 |

### Common Docker Commands

```bash
docker-compose up -d          # Start in background
docker-compose down           # Stop containers
docker-compose up --build     # Rebuild after changes
docker-compose logs -f        # View logs
docker-compose down --rmi all # Clean start
```

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
- 📦 Real-time order tracking

### Admin
- 📊 Dashboard analytics
- 🍕 Food/Category management
- 📦 Order management with status workflow
- 🚗 Driver integration (mock API)
- 🎫 Coupons & promotions
- ⚙️ Store settings
- 🔔 Real-time order notifications

### Delivery Flow
1. Customer places order → **Pending**
2. Admin confirms → **Confirmed**
3. Kitchen prepares → **Food Processing**
4. Admin calls driver → **Finding Driver**
5. Driver picks up → **Out for delivery**
6. Delivered to customer → **Delivered**

---

## 🔧 Tech Stack

**Frontend:** React, Vite, Leaflet Maps, AOS, Lucide Icons  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Payments:** Stripe  
**AI:** Mistral AI  
**Delivery:** Mock Driver API (Lalamove-compatible)  
**DevOps:** Docker, Nginx

---

## 📝 License

MIT License
