import express from "express";
import { chat } from "../controllers/chatbotController.js";

const chatbotRouter = express.Router();

chatbotRouter.post("/chat", chat);

export default chatbotRouter;
