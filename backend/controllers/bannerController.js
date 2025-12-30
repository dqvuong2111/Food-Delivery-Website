import bannerModel from "../models/bannerModel.js";
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// add banner
const addBanner = async (req, res) => {
    try {
        let image_url = `${req.file.filename}`;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image'
            });
            image_url = result.secure_url;
            fs.unlink(req.file.path, () => {});
        }

        const banner = new bannerModel({
            image: image_url
        });
        await banner.save();
        res.json({ success: true, message: "Banner Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// list banners
const listBanners = async (req, res) => {
    try {
        const banners = await bannerModel.find({});
        res.json({ success: true, data: banners });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// remove banner
const removeBanner = async (req, res) => {
    try {
        const banner = await bannerModel.findById(req.body.id);
        await bannerModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Banner Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addBanner, listBanners, removeBanner };