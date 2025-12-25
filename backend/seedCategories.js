import mongoose from "mongoose";
import categoryModel from "./models/categoryModel.js";
import { connectDB } from "./config/db.js";
import "dotenv/config";

const seedCategories = async () => {
    await connectDB();

    const categories = [
        { name: "Salad", image: "menu_1.png" },
        { name: "Rolls", image: "menu_2.png" },
        { name: "Deserts", image: "menu_3.png" },
        { name: "Sandwich", image: "menu_4.png" },
        { name: "Cake", image: "menu_5.png" },
        { name: "Pure Veg", image: "menu_6.png" },
        { name: "Pasta", image: "menu_7.png" },
        { name: "Noodles", image: "menu_8.png" }
    ];

    try {
        await categoryModel.deleteMany({}); // Clear existing categories to avoid duplicates
        await categoryModel.insertMany(categories);
        console.log("Categories seeded successfully!");
    } catch (error) {
        console.error("Error seeding categories:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedCategories();