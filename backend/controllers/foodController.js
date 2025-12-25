import foodModel from "../models/foodModel.js";
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import reviewModel from "../models/reviewModel.js";

const addFood = async (req, res) => {
    try {
        let image_url = `${req.file.filename}`;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image'
            });
            image_url = result.secure_url;
            fs.unlink(req.file.path, () => {});
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_url
        })

        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }
}

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        
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
        res.json({ success: false, message: "Error" })
    }
}

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    
    if (food.image && !food.image.startsWith('http')) {
        fs.unlink(`uploads/${food.image}`, () => {});
    } 

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

const toggleAvailability = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        food.available = !food.available;
        await food.save();
        res.json({ success: true, message: "Availability Updated" });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
}

export { addFood, listFood, removeFood, toggleAvailability };