import express from "express";
import { getEstimate, createDelivery, getDeliveryStatus } from "../controllers/deliveryController.js";
import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const deliveryRouter = express.Router();

// Public or User routes
deliveryRouter.post("/estimate", authMiddleware, getEstimate); // User checking shipping cost
deliveryRouter.post("/create", adminAuth, createDelivery);     // Admin assigns delivery after cooking
deliveryRouter.post("/status", authMiddleware, getDeliveryStatus); // User tracking

export default deliveryRouter;
