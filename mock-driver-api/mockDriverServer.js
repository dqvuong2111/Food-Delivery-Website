import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==================== IN-MEMORY STORAGE ====================
const quotations = new Map(); // quotationId -> quotation data
const orders = new Map();     // orderId -> order data

// Helper to generate IDs
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Haversine formula to calculate distance between two coordinates (in km)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Returns distance in km
};

// Calculate delivery price based on distance
const calculateDeliveryPrice = (stops) => {
    if (!stops || stops.length < 2) {
        // Fallback to base price if no coordinates
        return 15000;
    }

    const pickup = stops[0].coordinates;
    const dropoff = stops[1].coordinates;

    if (!pickup || !dropoff) {
        return 15000;
    }

    // Convert string coords to numbers
    const lat1 = parseFloat(pickup.lat);
    const lng1 = parseFloat(pickup.lng);
    const lat2 = parseFloat(dropoff.lat);
    const lng2 = parseFloat(dropoff.lng);

    if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
        console.log('[Mock API] Invalid coordinates, using fallback price');
        return 15000;
    }

    const distanceKm = calculateDistance(lat1, lng1, lat2, lng2);

    // Pricing formula:
    // Base fee: 15,000 VND
    // Per km: 5,000 VND
    // Minimum: 15,000 VND
    const basePrice = 15000;
    const pricePerKm = 5000;
    const totalPrice = Math.round(basePrice + (distanceKm * pricePerKm));

    console.log(`[Mock API] Distance: ${distanceKm.toFixed(2)} km, Price: ${totalPrice} VND`);

    return totalPrice;
};

// ==================== LALAMOVE API ENDPOINTS ====================

// 1. POST /v3/quotations - Get delivery quote
app.post('/v3/quotations', (req, res) => {
    console.log('[Mock API] POST /v3/quotations', req.body);

    const { data } = req.body;
    const stops = data?.stops || [];

    // Generate stopIds for each stop (preserve coordinates)
    const stopsWithIds = stops.map((stop, index) => ({
        stopId: generateId('STOP'),
        coordinates: stop.coordinates || { lat: '10.762622', lng: '106.660172' },
        address: stop.address || `Mock Address ${index + 1}`
    }));

    // Calculate price based on actual distance
    const deliveryPrice = calculateDeliveryPrice(stopsWithIds);

    const quotationId = generateId('QUO');
    const priceBreakdown = {
        base: deliveryPrice.toString(),
        currency: 'VND'
    };

    const quotation = {
        quotationId,
        scheduleAt: new Date().toISOString(),
        serviceType: data?.serviceType || 'MOTORCYCLE',
        stops: stopsWithIds,
        priceBreakdown,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
    };

    // Store quotation
    quotations.set(quotationId, quotation);

    console.log('[Mock API] Created quotation:', quotationId, 'Price:', deliveryPrice);

    res.json({
        data: quotation
    });
});

// 2. POST /v3/orders - Create delivery order
app.post('/v3/orders', (req, res) => {
    console.log('[Mock API] POST /v3/orders', req.body);

    const { data } = req.body;
    const { quotationId, sender, recipients } = data;

    // Verify quotation exists
    const quotation = quotations.get(quotationId);
    if (!quotation) {
        return res.status(400).json({
            message: 'Invalid quotation ID'
        });
    }

    const orderId = generateId('ORD');

    const order = {
        orderId,
        quotationId,
        status: 'ASSIGNING_DRIVER',
        sender,
        recipients,
        stops: quotation.stops,
        priceBreakdown: quotation.priceBreakdown,
        driver: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Store order
    orders.set(orderId, order);

    console.log('[Mock API] Created order:', orderId);

    res.json({
        data: {
            orderId,
            quotationId,
            status: 'ASSIGNING_DRIVER'
        }
    });
});

// 3. GET /v3/orders/:orderId - Track order
app.get('/v3/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    console.log('[Mock API] GET /v3/orders/', orderId);

    const order = orders.get(orderId);

    if (!order) {
        return res.status(404).json({
            message: 'Order not found'
        });
    }

    // Return order with driver info if assigned
    const response = {
        data: {
            orderId: order.orderId,
            status: order.status,
            priceBreakdown: order.priceBreakdown,
            stops: order.stops,
            driver: order.driver,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }
    };

    res.json(response);
});

// ==================== MOCK ADMIN ENDPOINTS ====================

// Get all orders (Admin)
app.get('/api/admin/orders', (req, res) => {
    const allOrders = Array.from(orders.values()).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ success: true, orders: allOrders });
});

// Update order status (Admin)
app.put('/api/admin/orders/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status, cancellationReason } = req.body;

    const order = orders.get(orderId);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Valid statuses: ASSIGNING_DRIVER, ON_GOING, PICKED_UP, COMPLETED, CANCELED
    const validStatuses = ['ASSIGNING_DRIVER', 'ON_GOING', 'PICKED_UP', 'COMPLETED', 'CANCELED'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    // Save cancellation reason if provided
    if (status === 'CANCELED' && cancellationReason) {
        order.cancellationReason = cancellationReason;
    }

    // Assign mock driver when status changes to ON_GOING
    if (status === 'ON_GOING' && !order.driver) {
        order.driver = {
            driverId: generateId('DRV'),
            name: 'Nguyen Van A (Mock Driver)',
            phone: '+84901234567',
            plateNumber: '59-A1 12345',
            photo: null
        };
    }

    orders.set(orderId, order);

    console.log(`[Mock API] Order ${orderId} status updated to: ${status}${cancellationReason ? ` (Reason: ${cancellationReason})` : ''}`);

    // AUTO-SYNC: Call backend webhook to update the order in the main database
    const BACKEND_WEBHOOK_URL = 'http://localhost:4000/api/webhook/driver';
    const webhookPayload = {
        eventType: 'ORDER_STATUS_CHANGED',
        orderId: order.orderId,
        status: order.status,
        cancellationReason: order.cancellationReason || null,
        timestamp: new Date().toISOString()
    };

    try {
        const webhookResponse = await fetch(BACKEND_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload)
        });
        console.log(`[Mock API] Auto-webhook sent to backend, response: ${webhookResponse.status}`);
    } catch (error) {
        console.error('[Mock API] Auto-webhook failed:', error.message);
        // Don't fail the request if webhook fails
    }

    res.json({ success: true, order });
});

// Trigger webhook to backend (Admin)
app.post('/api/admin/orders/:orderId/webhook', async (req, res) => {
    const { orderId } = req.params;
    const { backendUrl } = req.body; // e.g., http://localhost:4000/webhook/lalamove

    const order = orders.get(orderId);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!backendUrl) {
        return res.status(400).json({ success: false, message: 'backendUrl is required' });
    }

    const webhookPayload = {
        eventType: 'ORDER_STATUS_CHANGED',
        orderId: order.orderId,
        status: order.status,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload)
        });

        console.log(`[Mock API] Webhook sent to ${backendUrl}, status: ${response.status}`);
        res.json({ success: true, message: 'Webhook sent' });
    } catch (error) {
        console.error('[Mock API] Webhook error:', error.message);
        res.json({ success: false, message: error.message });
    }
});

// Clear all data (Admin)
app.delete('/api/admin/clear', (req, res) => {
    quotations.clear();
    orders.clear();
    console.log('[Mock API] All data cleared');
    res.json({ success: true, message: 'All data cleared' });
});

// ==================== ADMIN UI ====================
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    MOCK DRIVER API                           ║
║══════════════════════════════════════════════════════════════║
║  Server running at: http://localhost:${PORT}                   ║
║  Admin Panel:       http://localhost:${PORT}/admin             ║
║                                                              ║
║  API Endpoints (Lalamove-compatible):                        ║
║    POST /v3/quotations     - Get delivery quote              ║
║    POST /v3/orders         - Create delivery order           ║
║    GET  /v3/orders/:id     - Track order status              ║
║                                                              ║
║  To use: Set LALAMOVE_BASE_URL=http://localhost:${PORT}        ║
║  in your backend .env file                                   ║
╚══════════════════════════════════════════════════════════════╝
    `);
});
