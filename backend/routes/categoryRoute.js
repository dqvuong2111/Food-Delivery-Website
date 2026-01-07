import express from "express";
import { addCategory, listCategory, removeCategory } from "../controllers/categoryController.js";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";

const categoryRoute = express.Router();

const storage = multer.diskStorage({
	destination: "uploads",
	filename: (req, file, cb) => {
		return cb(null, `${Date.now()}${file.originalname}`);
	},
});

const upload = multer({ storage: storage });

categoryRoute.post("/add", adminAuth, upload.single("image"), addCategory);
categoryRoute.get("/list", listCategory);
categoryRoute.post("/remove", adminAuth, removeCategory);

export default categoryRoute;