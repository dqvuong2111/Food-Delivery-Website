# Food Delivery Website

A full-stack food delivery application with an Admin Panel, Frontend User Interface, and Backend API.

## Project Structure

*   `backend`: Node.js/Express API server.
*   `frontend`: React.js user interface for customers.
*   `admin`: React.js dashboard for restaurant management.

## Prerequisites

*   [Node.js](https://nodejs.org/) (v14 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## Setup Instructions

### Quick Start (Run Everything)

If you want to install and run all parts of the project (backend, frontend, admin) simultaneously from the root directory:

1.  **Install all dependencies:**
    ```bash
    npm install
    npm run install-all
    ```

2.  **Start all services:**
    ```bash
    npm run all
    ```
    This will start the backend, frontend, and admin panel concurrently.

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder and add your credentials:
    ```env
    PORT=4000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password
    ```
    *(Note: For Gmail, use an App Password, not your login password)*

4.  Start the server:
    ```bash
    npm run server
    ```
    The server will run on `http://localhost:4000`.

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will run on `http://localhost:5173`.

### 3. Admin Panel Setup

1.  Navigate to the admin directory:
    ```bash
    cd admin
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the admin dashboard:
    ```bash
    npm run dev
    ```
    The admin panel will run on `http://localhost:5174` (or similar).

## Features

*   **User Authentication:** Login, Register, Forgot Password.
*   **Product Management:** Admin can add/remove food items.
*   **Cart & Ordering:** Add to cart, place orders, payment integration.
*   **Profile Management:** Update user details, view order history.
*   **Wishlist:** Save favorite items.

## Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
