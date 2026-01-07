import reviewModel from "../models/reviewModel.js";
import foodModel from "../models/foodModel.js";

// Add Review
const addReview = async (req, res) => {
    try {
        const { foodId, rating, comment } = req.body;
        const review = new reviewModel({
            userId: req.body.userId,
            foodId,
            rating,
            comment
        });
        await review.save();
        res.json({ success: true, message: "Review Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding review" });
    }
}

// Get Reviews for a Food Item
const getFoodReviews = async (req, res) => {
    try {
        const { foodId } = req.body;
        const reviews = await reviewModel.find({ foodId });

        let avgRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            avgRating = (sum / reviews.length).toFixed(1);
        }

        res.json({ success: true, data: reviews, average: avgRating });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Get all reviews for homepage
const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find({})
            .sort({ date: -1 })
            .limit(10);

        const reviewsWithDetails = await Promise.all(reviews.map(async (review) => {
            const food = await foodModel.findById(review.foodId);
            return {
                ...review._doc,
                foodName: food ? food.name : "Unknown Item",
                foodImage: food ? food.image : ""
            }
        }));

        res.json({ success: true, data: reviewsWithDetails });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addReview, getFoodReviews, getAllReviews };