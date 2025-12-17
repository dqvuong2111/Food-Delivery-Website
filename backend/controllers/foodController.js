import foodModel from "../models/foodModel.js";
import fs from 'fs';
import reviewModel from "../models/reviewModel.js";

// add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        
        // Enrich with ratings
        const foodsWithRatings = await Promise.all(foods.map(async (food) => {
            const reviews = await reviewModel.find({ foodId: food._id });
            let avgRating = 0;
            if (reviews.length > 0) {
                const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
                avgRating = (sum / reviews.length).toFixed(1);
            }
            return { ...food._doc, averageRating: avgRating, reviewCount: reviews.length };
        }));

        res.json({ success: true, data: foodsWithRatings })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
export { addFood, listFood, removeFood };
