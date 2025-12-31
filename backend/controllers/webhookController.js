import orderModel from "../models/orderModel.js";

// Handle Lalamove Webhook Events
const handleWebhook = async (req, res) => {
    try {
        const event = req.body;
        
        // Log the event (for debugging)
        console.log("Webhook Received:", JSON.stringify(event, null, 2));

        // Lalamove sends different event types
        const eventType = event.eventType; // e.g., "ORDER_STATUS_CHANGED"
        const data = event.data;
        
        if (eventType === "ORDER_STATUS_CHANGED") {
             const { orderId, status } = data;
             
             // Map Lalamove status to your system's status
             let myStatus = "Food Processing";
             if (status === "ASSIGNING_DRIVER") myStatus = "Finding Driver";
             if (status === "ON_GOING") myStatus = "Out for delivery";
             if (status === "COMPLETED") myStatus = "Delivered";
             if (status === "CANCELED") myStatus = "Cancelled";

             // You need to find YOUR order using Lalamove's Order ID (stored in 'deliveryId' or similar)
             // This assumes you added a 'deliveryId' field to your orderModel
             // await orderModel.findOneAndUpdate({ deliveryId: orderId }, { status: myStatus });
             
             console.log(`Order ${orderId} updated to ${myStatus}`);
        }

        // Always return 200 OK to acknowledge receipt
        res.status(200).send("OK");

    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

export { handleWebhook };
