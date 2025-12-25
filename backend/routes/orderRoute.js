import express from "express"
import { listOrder, placeOrder, updateStatus, userOrders, verifyOrder, markAsRead } from "../controllers/orderController.js"
import authMiddleware from "../middleware/auth.js"
import adminAuth from "../middleware/adminAuth.js"

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",adminAuth,listOrder);
orderRouter.post("/status",adminAuth,updateStatus);
orderRouter.post("/mark-read", adminAuth, markAsRead);

export default orderRouter;