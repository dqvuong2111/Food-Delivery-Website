import React from "react";
import "./Orders.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { Package } from "lucide-react";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrder = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(url + "/api/order/list", {headers: {token}});
    if (response.data.success) {
      setOrders(response.data.data.reverse()); // Show newest first
    } else {
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    let reason = "";
    
    if (newStatus === "Cancelled") {
        reason = prompt("Please enter a reason for cancellation:", "Out of stock");
        if (reason === null) return; // Cancelled the prompt
    }

    const token = localStorage.getItem("token");
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: newStatus,
      cancellationReason: reason
    }, {headers: {token}});
    if (response.data.success) {
      await fetchAllOrder();
      toast.success("Order status updated");
    }
  };

  useEffect(() => {
    fetchAllOrder();
  }, []);

  return (
    <div className="order">
      <h3>Manage Orders</h3>
      <div className="order-grid">
        {orders.map((order, index) => (
          <div key={index} className="order-card">
            <div className="order-card-header">
              <div className="parcel-icon">
                  <Package size={24} color="#6b7280" />
              </div>
              <div className="order-id">
                <span className="label">Order ID</span>
                <span className="value">#{order._id.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            <div className="order-card-body">
              <div className="order-section">
                <p className="section-title">Items</p>
                <div className="food-list">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} <span className="qty">x{item.quantity}</span>
                      {idx !== order.items.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>

              <div className="order-section">
                <p className="section-title">Delivery To</p>
                <p className="customer-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <p className="customer-address">
                  {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}
                </p>
                <p className="customer-phone">{order.address.phone}</p>
              </div>
            </div>

            <div className="order-card-footer">
              <div className="order-summary">
                <div className="summary-item">
                  <span>Items</span>
                  <b>{order.items.length}</b>
                </div>
                <div className="summary-item">
                  <span>Total</span>
                  <b className="price">${order.amount}</b>
                </div>
              </div>
              
              <div className="order-status-control">
                <label>Status:</label>
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className={`status-select ${order.status.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Food Processing">Processing</option>
                  <option value="Out for delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;