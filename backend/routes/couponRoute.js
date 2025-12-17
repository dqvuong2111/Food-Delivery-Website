import express from "express";
import { addCoupon, listCoupons, removeCoupon, validateCoupon } from "../controllers/couponController.js";

const couponRouter = express.Router();

couponRouter.post("/add", addCoupon);
couponRouter.get("/list", listCoupons);
couponRouter.post("/remove", removeCoupon);
couponRouter.post("/validate", validateCoupon);

export default couponRouter;