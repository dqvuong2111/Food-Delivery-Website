import reviewModel from "../models/reviewModel.js";
import foodModel from "../models/foodModel.js";

// Add Review
const addReview = async (req, res) => {
    try {
        const { foodId, rating, comment } = req.body;
        const review = new reviewModel({
            userId: req.body.userId, // From auth middleware
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

export { addReview, getFoodReviews };