import categoryModel from "../models/categoryModel.js";
import fs from 'fs';

// Add Category
const addCategory = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const category = new categoryModel({
        name: req.body.name,
        image: image_filename
    })

    try {
        await category.save();
        res.json({ success: true, message: "Category Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// List Categories
const listCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.json({ success: true, data: categories })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Remove Category
const removeCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.body.id);
        fs.unlink(`uploads/${category.image}`, () => { })

        await categoryModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Category Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { addCategory, listCategory, removeCategory }