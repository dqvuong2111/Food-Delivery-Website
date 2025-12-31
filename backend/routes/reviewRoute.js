import express from "express";
import { addReview, getFoodReviews, getAllReviews } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", authMiddleware, addReview);
reviewRouter.post("/list", getFoodReviews);
reviewRouter.get("/all", getAllReviews);

export default reviewRouter;