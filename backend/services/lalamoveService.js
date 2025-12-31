import axios from 'axios';
import CryptoJS from 'crypto-js';

const LALAMOVE_API_KEY = process.env.LALAMOVE_API_KEY
const LALAMOVE_API_SECRET = process.env.LALAMOVE_SECRET
const BASE_URL = process.env.LALAMOVE_BASE_URL

// Helper to generate signature (Lalamove requirement)
const generateSignature = (method, path, body, timestamp) => {
    const rawSignature = `${timestamp}\r\n${method}\r\n${path}\r\n\r\n${body}`;
    return CryptoJS.HmacSHA256(rawSignature, LALAMOVE_API_SECRET).toString();
};

const getHeaders = (method, path, body) => {
    const timestamp = new Date().getTime();
    const signature = generateSignature(method, path, body, timestamp);
    return {
        'Content-Type': 'application/json',
        'Authorization': `hmac ${LALAMOVE_API_KEY}:${timestamp}:${signature}`,
        'Market': 'VN', 
    };
};

// 1. Get Delivery Quote (Price)
export const getDeliveryQuote = async (pickup, dropoff) => {
    // pickup and dropoff can be { address: "..." } OR { lat: "...", lng: "...", address: "..." }
    
    const formatStop = (location) => {
        if (location.lat && location.lng) {
            return {
                coordinates: {
                    lat: location.lat,
                    lng: location.lng
                },
                address: location.address 
            };
        }
        return { address: location.address };
    };

    const path = '/v3/quotations';
    const body = JSON.stringify({
        data: {
            serviceType: "MOTORCYCLE", 
            stops: [
                formatStop(pickup),
                formatStop(dropoff)
            ],
            language: "vi_VN"
        }
    });

    try {
        const response = await axios.post(`${BASE_URL}${path}`, body, {
            headers: getHeaders('POST', path, body)
        });
        return response.data; // Trả về toàn bộ response để lấy stopId
    } catch (error) {
        console.error("Lalamove Quote Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to get quote");
    }
};

// 2. Place Order (CẬP NHẬT CHUẨN V3)
export const placeDeliveryOrder = async (quotation, senderContact, recipientContact) => {
    const path = '/v3/orders';
    
    // API v3 yêu cầu gửi lại danh sách 'stops' nhưng bổ sung thông tin liên hệ vào từng stop
    // quotation.stops chứa danh sách các điểm dừng kèm theo stopId
    
    const stops = quotation.stops.map((stop, index) => {
        // Stop đầu tiên là người gửi (Sender)
        if (index === 0) {
            return {
                stopId: stop.stopId, // Quan trọng: Phải có stopId từ quotation
                name: senderContact.name,
                phone: senderContact.phone
            };
        }
        // Stop cuối cùng (hoặc các stop sau) là người nhận (Recipient)
        return {
            stopId: stop.stopId, // Quan trọng
            name: recipientContact.name,
            phone: recipientContact.phone
        };
    });

    const body = JSON.stringify({
        data: {
            quotationId: quotation.quotationId,
            sender: {
                stopId: quotation.stops[0].stopId,
                name: senderContact.name,
                phone: senderContact.phone
            },
            recipients: [
                {
                    stopId: quotation.stops[1].stopId,
                    name: recipientContact.name,
                    phone: recipientContact.phone
                }
            ],
            isPODEnabled: true 
        }
    });

    try {
        const response = await axios.post(`${BASE_URL}${path}`, body, {
            headers: getHeaders('POST', path, body)
        });
        return response.data;
    } catch (error) {
        console.error("Lalamove Order Error:", error.response?.data || error.message);
        throw error; // Ném lỗi để Controller bắt được
    }
};

// 3. Track Order
export const trackOrder = async (orderId) => {
    const path = `/v3/orders/${orderId}`;
    const body = ''; // GET request has no body

    try {
        const response = await axios.get(`${BASE_URL}${path}`, {
            headers: getHeaders('GET', path, body)
        });
        return response.data;
    } catch (error) {
        console.error("Lalamove Track Error:", error.response?.data || error.message);
        throw new Error("Failed to track order");
    }
};