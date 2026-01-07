import express from "express";
import {
	addFood,
	listFood,
	removeFood,
	toggleAvailability,
	updateFood
} from "../controllers/foodController.js";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";

const foodRoute = express.Router();
//Image Storage Engine
const storage = multer.diskStorage({
	destination: "uploads",
	filename: (req, file, cb) => {
		return cb(null, `${Date.now()}${file.originalname}`);
	},
});
const upload = multer({ storage: storage });

foodRoute.post("/add", adminAuth, upload.single("image"), addFood);
foodRoute.get("/list", listFood);
foodRoute.post("/remove", adminAuth, removeFood);
foodRoute.post("/toggle", adminAuth, toggleAvailability);
foodRoute.post("/update", adminAuth, updateFood);

export default foodRoute;
