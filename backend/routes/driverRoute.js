import express from "express";
import { loginDriver, registerDriver, getDriverProfile, updateDriverStatus } from "../controllers/driverController.js";
import authMiddleware from "../middleware/auth.js";

const driverRouter = express.Router();

driverRouter.post("/register", registerDriver);
driverRouter.post("/login", loginDriver);
driverRouter.get("/profile", authMiddleware, getDriverProfile);
driverRouter.post("/status", authMiddleware, updateDriverStatus);

export default driverRouter;
