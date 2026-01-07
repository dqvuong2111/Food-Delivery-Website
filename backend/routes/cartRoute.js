import express from "express";
import {
	addToCart,
	removeFromCart,
	getCart,
	deleteFromCart,
	clearCart
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRoute = express.Router();

cartRoute.post("/add", authMiddleware, addToCart);
cartRoute.post("/remove", authMiddleware, removeFromCart);
cartRoute.post("/delete", authMiddleware, deleteFromCart);
cartRoute.post("/get", authMiddleware, getCart);
cartRoute.post("/clear", authMiddleware, clearCart);

export default cartRoute;
