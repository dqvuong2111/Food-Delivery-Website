import express from "express";
import { handleWebhook } from "../controllers/webhookController.js";

const webhookRouter = express.Router();

// Webhook endpoint (Public, but should verify signature in production)
webhookRouter.post("/lalamove", handleWebhook);

export default webhookRouter;
