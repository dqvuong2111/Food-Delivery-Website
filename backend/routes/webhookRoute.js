import express from "express";
import { handleWebhook } from "../controllers/webhookController.js";

const webhookRouter = express.Router();

// Webhook endpoint for Driver API status updates
webhookRouter.post("/driver", handleWebhook);

export default webhookRouter;
