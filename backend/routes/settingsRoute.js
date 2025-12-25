import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import adminAuth from "../middleware/adminAuth.js";

const settingsRoute = express.Router();

settingsRoute.get("/get", getSettings);
settingsRoute.post("/update", adminAuth, updateSettings);

export default settingsRoute;