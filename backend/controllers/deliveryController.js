import { getDeliveryQuote, placeDeliveryOrder, trackOrder } from '../services/lalamoveService.js';
import { getCoordinates } from '../services/googleMapsService.js';
import orderModel from '../models/orderModel.js';

// Helper: Chuẩn hóa số điện thoại sang E.164 (VN)
const formatPhone = (phone) => {
    if (!phone) return "+84900000000"; // Fallback nếu không có số (tránh lỗi crash)
    
    // Xóa tất cả ký tự không phải số (trừ dấu +)
    let cleanPhone = phone.replace(/[^\d+]/g, '');

    // Nếu bắt đầu bằng 0, đổi thành +84
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '+84' + cleanPhone.substring(1);
    }
    
    // Nếu chưa có dấu +, thêm vào (giả định là +84 nếu thiếu)
    if (!cleanPhone.startsWith('+')) {
        cleanPhone = '+84' + cleanPhone;
    }

    return cleanPhone;
};

// Get Shipping Cost
const getEstimate = async (req, res) => {
    const { pickup, dropoff } = req.body; 
    console.log(`[Lalamove Estimate] Request: ${pickup} -> ${dropoff}`);

    try {
        const pickupLoc = await getCoordinates(pickup);
        const dropoffLoc = await getCoordinates(dropoff);
        console.log(`[Google Maps] Coords found:`, { pickupLoc, dropoffLoc });

        const quote = await getDeliveryQuote(pickupLoc, dropoffLoc);
        console.log(`[Lalamove] Quote success:`, quote.data?.quotationId);
        
        res.json({ success: true, data: quote, locations: { pickup: pickupLoc, dropoff: dropoffLoc } });
    } catch (error) {
        console.error("[Estimate Error]", error.message);
        res.json({ success: false, message: error.message });
    }
};

// Create Delivery Request (After user pays)
const createDelivery = async (req, res) => {
    const { orderId, quotation } = req.body; 
    console.log(`[Lalamove Create] Order: ${orderId}, Quote ID: ${quotation?.quotationId}`);
    
    try {
        const order = await orderModel.findById(orderId);
        if (!order) return res.json({ success: false, message: "Order not found" });

        // Chuẩn hóa số điện thoại
        const senderPhone = formatPhone("0901234567"); // Số của nhà hàng
        const recipientPhone = formatPhone(order.address.phone);

        console.log(`[Phone Debug] Sender: ${senderPhone}, Recipient: ${recipientPhone}`);

        const sender = {
            name: "My Restaurant",
            phone: senderPhone 
        };

        const recipient = {
            name: `${order.address.firstName} ${order.address.lastName}`,
            phone: recipientPhone 
        };

        const deliveryData = await placeDeliveryOrder(quotation, sender, recipient);
        
        console.log(`[Lalamove] Order Placed:`, deliveryData);

        // LƯU VÀO DATABASE
        // deliveryData.data.orderId là ID của đơn Lalamove
        const lalamoveOrderId = deliveryData.data?.orderId || deliveryData.orderId; 
        
        order.deliveryId = lalamoveOrderId;
        order.deliveryStatus = "ASSIGNING_DRIVER";
        order.status = "Finding Driver";
        await order.save();

        res.json({ 
            success: true, 
            message: "Delivery Assigned", 
            data: deliveryData,
            lalamoveOrderId: lalamoveOrderId // Send explicitly
        });

    } catch (error) {
        console.error("[Create Delivery Error]", error.message);
        if(error.response) {
            console.error(">>> LALAMOVE REASON:", JSON.stringify(error.response.data, null, 2));
        }
        const backendMsg = error.response?.data?.message || error.message;
        res.json({ success: false, message: backendMsg });
    }
};

const getDeliveryStatus = async (req, res) => {
    const { deliveryId, orderId } = req.body; 
    try {
        const lalamoveData = await trackOrder(deliveryId);
        const lalamoveStatus = lalamoveData.status || lalamoveData.data?.status; // Check structure

        if (orderId && lalamoveStatus) {
            // Map Lalamove status to System status
            let myStatus = "Food Processing";
            if (lalamoveStatus === "ASSIGNING_DRIVER") myStatus = "Finding Driver";
            if (lalamoveStatus === "ON_GOING") myStatus = "Out for delivery";
            if (lalamoveStatus === "PICKED_UP") myStatus = "Out for delivery";
            if (lalamoveStatus === "COMPLETED") myStatus = "Delivered";
            if (lalamoveStatus === "CANCELED" || lalamoveStatus === "EXPIRED") myStatus = "Cancelled";

            await orderModel.findByIdAndUpdate(orderId, { 
                deliveryStatus: lalamoveStatus,
                status: myStatus
            });
        }

        res.json({ success: true, data: lalamoveData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { getEstimate, createDelivery, getDeliveryStatus };