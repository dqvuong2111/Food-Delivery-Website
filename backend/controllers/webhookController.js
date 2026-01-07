import orderModel from "../models/orderModel.js";

// Handle Driver API Webhook Events
const handleWebhook = async (req, res) => {
    try {
        const event = req.body;

        // Log for debugging
        console.log("[Webhook] Received:", JSON.stringify(event, null, 2));

        const eventType = event.eventType;

        if (eventType === "ORDER_STATUS_CHANGED") {
            const { orderId, status, cancellationReason } = event;

            // Map driver status to system status
            let myStatus = "Food Processing";
            if (status === "ASSIGNING_DRIVER") myStatus = "Finding Driver";
            if (status === "ON_GOING") myStatus = "Out for delivery";
            if (status === "PICKED_UP") myStatus = "Out for delivery";
            if (status === "COMPLETED") myStatus = "Delivered";
            if (status === "CANCELED") myStatus = "Cancelled";

            // Build update object
            const updateData = {
                status: myStatus,
                deliveryStatus: status
            };

            // Add cancellation reason if provided (from driver)
            if (status === "CANCELED" && cancellationReason) {
                updateData.cancellationReason = `Driver: ${cancellationReason}`;
            }

            // Update order by deliveryId
            await orderModel.findOneAndUpdate(
                { deliveryId: orderId },
                updateData
            );

            console.log(`[Webhook] Order ${orderId} updated to ${myStatus}${cancellationReason ? ` (Reason: ${cancellationReason})` : ''}`);
        }

        res.status(200).send("OK");

    } catch (error) {
        console.error("[Webhook] Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

export { handleWebhook };
