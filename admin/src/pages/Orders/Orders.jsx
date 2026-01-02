import React, { useState, useEffect } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Package, Truck, MapPin, Phone, User, ChevronRight, CheckCircle, XCircle } from "lucide-react";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loadingDelivery, setLoadingDelivery] = useState({});

  const fetchAllOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }
      const response = await axios.get(url + "/api/order/list", { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data.message || "Error fetching orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error or server is down");
    }
  };

  // Define the order status flow
  const statusFlow = ["Pending", "Confirmed", "Food Processing"];

  // Get next status in the flow
  const getNextStatus = (currentStatus) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex !== -1 && currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  // Check if order can be advanced to next status
  const canAdvanceStatus = (order) => {
    if (order.deliveryId) return false; // Driver already called
    if (order.status === "Delivered" || order.status === "Cancelled") return false;
    return getNextStatus(order.status) !== null;
  };

  // Check if order is ready to call driver
  const canCallDriver = (order) => {
    return order.status === "Food Processing" && !order.deliveryId;
  };

  // Advance to next status
  const advanceStatus = async (orderId, nextStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: nextStatus
      }, { headers: { token } });

      if (response.data.success) {
        toast.success(`Order updated to ${nextStatus}`);
        await fetchAllOrder();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    const reason = prompt("Please enter a reason for cancellation:", "Out of stock");
    if (reason === null) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: "Cancelled",
        cancellationReason: reason
      }, { headers: { token } });

      if (response.data.success) {
        toast.success("Order cancelled");
        await fetchAllOrder();
      }
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  // Call Driver
  const handleDriverRequest = async (order) => {
    if (!window.confirm("Call driver for this order?")) return;

    setLoadingDelivery(prev => ({ ...prev, [order._id]: true }));
    const token = localStorage.getItem("token");

    try {
      const pickupAddress = "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội";
      const dropoffAddress = `${order.address.street}, ${order.address.city}`;

      toast.info("Getting delivery quote...");

      const estimateRes = await axios.post(url + "/api/delivery/estimate", {
        pickup: pickupAddress,
        dropoff: dropoffAddress
      }, { headers: { token } });

      if (!estimateRes.data.success) {
        throw new Error(estimateRes.data.message || "Failed to get quote");
      }

      const quoteData = estimateRes.data.data.data || estimateRes.data.data;

      if (!quoteData || !quoteData.priceBreakdown) {
        throw new Error("Invalid quote data");
      }

      const shippingFee = quoteData.priceBreakdown.total || quoteData.priceBreakdown.base;

      if (!window.confirm(`Delivery fee: ${Number(shippingFee).toLocaleString()} VND. Confirm?`)) {
        setLoadingDelivery(prev => ({ ...prev, [order._id]: false }));
        return;
      }

      toast.info("Finding driver...");

      const createRes = await axios.post(url + "/api/delivery/create", {
        orderId: order._id,
        quotation: quoteData
      }, { headers: { token } });

      if (createRes.data.success) {
        toast.success("✅ Driver assigned successfully!");
        await fetchAllOrder();
      } else {
        throw new Error(createRes.data.message || "Failed to assign driver");
      }

    } catch (error) {
      console.error(error);
      toast.error("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingDelivery(prev => ({ ...prev, [order._id]: false }));
    }
  };

  useEffect(() => {
    fetchAllOrder();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchAllOrder, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f59e0b',
      'Confirmed': '#3b82f6',
      'Food Processing': '#8b5cf6',
      'Finding Driver': '#06b6d4',
      'Out for delivery': '#10b981',
      'Delivered': '#22c55e',
      'Cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusStep = (status, order) => {
    // If driver cancelled, show at Driver stage
    if (order?.deliveryId && (status === 'Cancelled' || order?.deliveryStatus === 'CANCELED')) {
      return 4; // Driver stage
    }

    const steps = {
      'Pending': 1,
      'Confirmed': 2,
      'Food Processing': 3,
      'Finding Driver': 4,
      'Out for delivery': 5,
      'Delivered': 6,
      'Cancelled': 0
    };
    return steps[status] || 0;
  };

  return (
    <div className="order">
      <h3>Manage Orders</h3>
      <div className="order-grid">
        {orders.map((order, index) => (
          <div key={index} className="order-card">
            {/* Header */}
            <div className="order-card-header">
              <div className="header-left">
                <Package size={20} color="#6366f1" />
                <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
              </div>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
              >
                {order.status}
              </span>
            </div>

            {/* Progress Steps */}
            <div className="status-progress">
              {["Pending", "Confirmed", "Processing", "Driver"].map((step, i) => (
                <div key={i} className={`progress-step ${getStatusStep(order.status, order) > i ? 'completed' : ''} ${getStatusStep(order.status, order) === i + 1 ? 'current' : ''}`}>
                  <div className="step-dot"></div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* Order Items */}
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="item-row">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">×{item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Customer Info */}
            <div className="customer-info">
              <div className="info-row">
                <User size={14} />
                <span>{order.address.firstName} {order.address.lastName}</span>
              </div>
              <div className="info-row">
                <MapPin size={14} />
                <span>{order.address.street}, {order.address.city}</span>
              </div>
              <div className="info-row">
                <Phone size={14} />
                <span>{order.address.phone}</span>
              </div>
            </div>

            {/* Delivery Info */}
            {order.deliveryId && (
              <div className={`delivery-badge ${order.deliveryStatus === 'CANCELED' ? 'cancelled' : ''}`}>
                <Truck size={14} />
                <span>Driver: {order.deliveryId.slice(-8)}</span>
                <span className={`delivery-status ${order.deliveryStatus === 'CANCELED' ? 'status-cancelled' : ''}`}>
                  {order.deliveryStatus}
                </span>
              </div>
            )}

            {/* Order Total */}
            <div className="order-total">
              <span>Total</span>
              <span className="price">{order.amount.toLocaleString()} ₫</span>
            </div>

            {/* Action Buttons */}
            <div className="order-actions">
              {order.status === "Cancelled" && (
                <div className="cancelled-notice">
                  <XCircle size={16} />
                  Order Cancelled
                </div>
              )}

              {order.status === "Delivered" && (
                <div className="delivered-notice">
                  <CheckCircle size={16} />
                  Order Completed
                </div>
              )}

              {/* Next Step Button */}
              {canAdvanceStatus(order) && (
                <button
                  className="btn-next-step"
                  onClick={() => advanceStatus(order._id, getNextStatus(order.status))}
                >
                  <span>Move to {getNextStatus(order.status)}</span>
                  <ChevronRight size={18} />
                </button>
              )}

              {/* Call Driver Button */}
              {canCallDriver(order) && (
                <button
                  className="btn-driver"
                  onClick={() => handleDriverRequest(order)}
                  disabled={loadingDelivery[order._id]}
                >
                  <Truck size={16} />
                  {loadingDelivery[order._id] ? "Processing..." : "Call Driver"}
                </button>
              )}

              {/* Cancel Button (only before driver is called) */}
              {!order.deliveryId && order.status !== "Cancelled" && order.status !== "Delivered" && (
                <button
                  className="btn-cancel"
                  onClick={() => cancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;