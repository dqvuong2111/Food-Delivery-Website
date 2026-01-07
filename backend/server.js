import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js"
import couponRouter from "./routes/couponRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
import dashboardRouter from "./routes/dashboardRoute.js"
import bannerRouter from "./routes/bannerRoute.js"
import categoryRouter from "./routes/categoryRoute.js"
import settingsRouter from "./routes/settingsRoute.js"
import driverRouter from "./routes/driverRoute.js"
import deliveryRouter from "./routes/deliveryRoute.js"
import webhookRouter from "./routes/webhookRoute.js"
import chatbotRouter from "./routes/chatbotRoute.js"
import connectCloudinary from "./config/cloudinary.js";

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();
connectCloudinary();

// api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/driver", driverRouter)
app.use("/api/delivery", deliveryRouter)
app.use("/api/webhook", webhookRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/coupon", couponRouter)
app.use("/api/review", reviewRouter)
app.use("/api/dashboard", dashboardRouter)
app.use("/api/banner", bannerRouter)
app.use("/api/category", categoryRouter)
app.use("/api/settings", settingsRouter)
app.use("/api/chatbot", chatbotRouter)

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server Started on http://localhost:${port} (IPv4)`);
});
