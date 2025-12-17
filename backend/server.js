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

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/coupon",couponRouter)
app.use("/api/review",reviewRouter)
app.use("/api/dashboard",dashboardRouter)

app.get("/",(req,res)=>{
  res.send("API Working hehehehe");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
//mongodb+srv://greatstack:hoitinhnghich@123@cluster0.32be1o3.mongodb.net/?
