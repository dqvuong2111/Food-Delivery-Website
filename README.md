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

## 🐳 Docker Deployment (Recommended for New Users)

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

Create `backend/.env` file with your credentials (ask the project owner for values):

```env
MONGO_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
MISTRAL_API_KEY=your_mistral_key
```

### Step 4: Build and Run with Docker

Open a terminal in the project folder and run:

```bash
# First time - build and start all containers
docker-compose up --build

# This will take 5-10 minutes on first run
# Wait until you see "Server Started on http://localhost:4000"
```

### Step 5: Access the Application

Open your browser and go to:

| Service | URL |
|---------|-----|
| 🌐 Frontend (Customer) | http://localhost |
| 🔧 Admin Panel | http://localhost:8080 |
| 🔌 Backend API | http://localhost:4000 |

### Common Docker Commands

```bash
# Start containers (in background)
docker-compose up -d

# Stop containers
docker-compose down

# Rebuild after code changes
docker-compose up --build

# View logs
docker-compose logs -f

# Remove all containers and images (clean start)
docker-compose down --rmi all
```

### Troubleshooting

- **Port in use error**: Stop other apps using ports 80, 4000, or 8080
- **Docker not starting**: Restart Docker Desktop
- **Build failed**: Run `docker-compose down --rmi all` then try again

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
