import express from 'express';
import { loginUser, registerUser, registerAdmin, listAdmins, removeAdmin, getProfile, updateProfile, addToWishlist, removeFromWishlist, getWishlist, forgotPassword, resetPassword } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/register-admin", adminAuth, registerAdmin);
userRouter.get("/admin/list", adminAuth, listAdmins);
userRouter.post("/admin/remove", adminAuth, removeAdmin);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.post("/update-profile", authMiddleware, updateProfile);
userRouter.post("/add-wishlist", authMiddleware, addToWishlist);
userRouter.post("/remove-wishlist", authMiddleware, removeFromWishlist);
userRouter.get("/get-wishlist", authMiddleware, getWishlist);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;