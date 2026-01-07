import axios from 'axios';
import { getCoordinates } from '../services/googleMapsService.js';
import orderModel from '../models/orderModel.js';

const DRIVER_API_URL = process.env.DRIVER_API_URL || 'http://127.0.0.1:5001';

const formatPhone = (phone) => {
    if (!phone) return "+84900000000";
    let cleanPhone = phone.replace(/[^\d+]/g, '');
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '+84' + cleanPhone.substring(1);
    }
    if (!cleanPhone.startsWith('+')) {
        cleanPhone = '+84' + cleanPhone;
    }
    return cleanPhone;
};

// Get Shipping Cost Estimate
const getEstimate = async (req, res) => {
    const { pickup, dropoff } = req.body;
    console.log(`[Delivery] Estimate: ${pickup} -> ${dropoff}`);

    try {
        // Get coordinates from addresses
        const pickupLoc = await getCoordinates(pickup);
        const dropoffLoc = await getCoordinates(dropoff);
        console.log(`[Delivery] Coords found:`, { pickupLoc, dropoffLoc });

        // Call Mock Driver API for quotation
        const response = await axios.post(`${DRIVER_API_URL}/v3/quotations`, {
            data: {
                serviceType: "MOTORCYCLE",
                stops: [
                    { coordinates: { lat: pickupLoc.lat, lng: pickupLoc.lng }, address: pickupLoc.address },
                    { coordinates: { lat: dropoffLoc.lat, lng: dropoffLoc.lng }, address: dropoffLoc.address }
                ],
                language: "vi_VN"
            }
        });

        console.log(`[Delivery] Quote success:`, response.data.data?.quotationId);

        res.json({
            success: true,
            data: response.data,
            locations: { pickup: pickupLoc, dropoff: dropoffLoc }
        });
    } catch (error) {
        console.error("[Delivery] Estimate Error Details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        res.json({
            success: false,
            message: error.response?.data?.message || error.message || "Unknown delivery estimate error"
        });
    }
};

// Create Delivery Order (After admin approves)
const createDelivery = async (req, res) => {
    const { orderId, quotation } = req.body;
    console.log(`[Delivery] Create: Order ${orderId}, Quote ID: ${quotation?.quotationId}`);

    try {
        const order = await orderModel.findById(orderId);
        if (!order) return res.json({ success: false, message: "Order not found" });

        // Prepare sender and recipient info
        const senderPhone = formatPhone("0901234567"); // Restaurant phone
        const recipientPhone = formatPhone(order.address.phone);

        const sender = {
            stopId: quotation.stops[0].stopId,
            name: "My Restaurant",
            phone: senderPhone
        };

        const recipient = {
            stopId: quotation.stops[1].stopId,
            name: `${order.address.firstName} ${order.address.lastName}`,
            phone: recipientPhone
        };

        // Call Mock Driver API to create order
        const response = await axios.post(`${DRIVER_API_URL}/v3/orders`, {
            data: {
                quotationId: quotation.quotationId,
                sender: sender,
                recipients: [recipient],
                isPODEnabled: true
            }
        });

        const deliveryData = response.data;
        console.log(`[Delivery] Order Placed:`, deliveryData);

        // Save delivery ID to database
        const driverOrderId = deliveryData.data?.orderId || deliveryData.orderId;
        order.deliveryId = driverOrderId;
        order.deliveryStatus = "ASSIGNING_DRIVER";
        order.status = "Finding Driver";
        await order.save();

        res.json({
            success: true,
            message: "Delivery Assigned",
            data: deliveryData,
            lalamoveOrderId: driverOrderId // Keep for backward compatibility
        });

    } catch (error) {
        console.error("[Delivery] Create Error:", error.message);
        const backendMsg = error.response?.data?.message || error.message;
        res.json({ success: false, message: backendMsg });
    }
};

// Get Delivery Status
const getDeliveryStatus = async (req, res) => {
    const { deliveryId, orderId } = req.body;

    try {
        // Check if order is already finalized
        const currentOrder = await orderModel.findById(orderId);
        if (currentOrder && (currentOrder.status === 'Delivered' || currentOrder.status === 'Cancelled')) {
            return res.json({
                success: true,
                data: { status: currentOrder.status },
                message: 'Status already finalized'
            });
        }

        // Call Mock Driver API to get status
        const response = await axios.get(`${DRIVER_API_URL}/v3/orders/${deliveryId}`);
        const driverData = response.data;
        const driverStatus = driverData.status || driverData.data?.status;

        if (orderId && driverStatus) {
            // Map driver status to system status
            let myStatus = "Food Processing";
            if (driverStatus === "ASSIGNING_DRIVER") myStatus = "Finding Driver";
            if (driverStatus === "ON_GOING") myStatus = "Out for delivery";
            if (driverStatus === "PICKED_UP") myStatus = "Out for delivery";
            if (driverStatus === "COMPLETED") myStatus = "Delivered";
            if (driverStatus === "CANCELED" || driverStatus === "EXPIRED") myStatus = "Cancelled";

            await orderModel.findByIdAndUpdate(orderId, {
                deliveryStatus: driverStatus,
                status: myStatus
            });
        }

        res.json({ success: true, data: driverData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { getEstimate, createDelivery, getDeliveryStatus };