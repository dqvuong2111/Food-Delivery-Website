import express from "express";
import { addCoupon, listCoupons, removeCoupon, validateCoupon } from "../controllers/couponController.js";
import adminAuth from "../middleware/adminAuth.js";

const couponRouter = express.Router();

couponRouter.post("/add", adminAuth, addCoupon);
couponRouter.get("/list", listCoupons);
couponRouter.post("/remove", adminAuth, removeCoupon);
couponRouter.post("/validate", validateCoupon);

export default couponRouter;