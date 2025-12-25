import express from "express";
import { addBanner, listBanners, removeBanner } from "../controllers/bannerController.js";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";

const bannerRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

bannerRouter.post("/add", adminAuth, upload.single("image"), addBanner);
bannerRouter.get("/list", listBanners);
bannerRouter.post("/remove", adminAuth, removeBanner);

export default bannerRouter;