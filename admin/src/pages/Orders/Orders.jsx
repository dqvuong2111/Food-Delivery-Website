import React, { useState, useEffect } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Package, Truck } from "lucide-react"; // Added Truck icon

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loadingDelivery, setLoadingDelivery] = useState(false); // Loading state for delivery request

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

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    let reason = "";

    if (newStatus === "Cancelled") {
      reason = prompt("Please enter a reason for cancellation:", "Out of stock");
      if (reason === null) return;
    }

    const token = localStorage.getItem("token");
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: newStatus,
      cancellationReason: reason
    }, { headers: { token } });
    if (response.data.success) {
      await fetchAllOrder();
      toast.success("Order status updated");
    }
  };

  // --- LALAMOVE INTEGRATION ---
  const handleLalamoveRequest = async (order) => {
    if (!window.confirm("Bạn có chắc muốn gọi tài xế Lalamove cho đơn hàng này?")) return;

    setLoadingDelivery(true);
    const token = localStorage.getItem("token");

    try {
      // 1. Địa chỉ cửa hàng (Hardcode để test - Đổi sang Hà Nội cho gần khách hàng)
      const pickupAddress = "Vincom Center Ba Trieu, Hai Ba Trung, Hanoi";

      // 2. Địa chỉ khách hàng
      const dropoffAddress = `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipcode}`;

      toast.info("Đang lấy báo giá vận chuyển...");

      // Bước 1: Lấy báo giá (Estimate)
      const estimateRes = await axios.post(url + "/api/delivery/estimate", {
        pickup: pickupAddress,
        dropoff: dropoffAddress
      }, { headers: { token } });

      console.log("Lalamove Response:", estimateRes.data); // Xem log này trên Browser Console (F12)

      if (!estimateRes.data.success) {
        throw new Error(estimateRes.data.message || "Không lấy được báo giá");
      }

      // Backend trả về: { success: true, data: { ...LalamoveData... } }
      // Lalamove Data có thể nằm trong estimateRes.data.data.data hoặc estimateRes.data.data
      const quoteData = estimateRes.data.data.data || estimateRes.data.data;

      if (!quoteData || !quoteData.priceBreakdown) {
        console.error("Cấu trúc JSON lạ:", quoteData);
        throw new Error("Dữ liệu báo giá không hợp lệ");
      }

      const quotationId = quoteData.quotationId;
      const shippingFee = quoteData.priceBreakdown.total;

      // Hỏi lại Admin lần nữa về giá
      if (!window.confirm(`Phí ship ước tính là: ${shippingFee} VND. Đồng ý đặt xe?`)) {
        setLoadingDelivery(false);
        return;
      }

      toast.info("Đang tìm tài xế...");

      // Bước 2: Tạo đơn hàng (Place Order)
      // Gửi toàn bộ quoteData (chứa stops và stopId) sang backend
      const createRes = await axios.post(url + "/api/delivery/create", {
        orderId: order._id,
        quotation: quoteData
      }, { headers: { token } });

      if (createRes.data.success) {
        toast.success("✅ Đã gọi xe thành công! Mã đơn: " + createRes.data.lalamoveOrderId);
        await fetchAllOrder();
      } else {
        throw new Error(createRes.data.message || "Lỗi khi tạo đơn giao hàng");
      }

    } catch (error) {
      console.error(error);
      toast.error("Lỗi gọi xe: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingDelivery(false);
    }
  };

  const simulateLalamove = async (orderId, lalamoveStatus) => {
    // Gi giả lập Webhook/Polling logic
    // Map Lalamove status to System status
    let myStatus = "Food Processing";
    if (lalamoveStatus === "ASSIGNING_DRIVER") myStatus = "Finding Driver";
    if (lalamoveStatus === "ON_GOING") myStatus = "Out for delivery";
    if (lalamoveStatus === "COMPLETED") myStatus = "Delivered";
    if (lalamoveStatus === "CANCELED") myStatus = "Cancelled";

    try {
      const token = localStorage.getItem("token");
      // Cập nhật trực tiếp vào DB thông qua API updateStatus (hoặc tạo API riêng nếu cần)
      // Ở đây ta dùng updateStatus hiện có để đổi trạng thái đơn hàng hệ thống
      await axios.post(url + "/api/order/status", {
        orderId,
        status: myStatus
      }, { headers: { token } });

      // Nếu muốn cập nhật cả field 'deliveryStatus' trong DB, ta cần API hỗ trợ.
      // Hiện tại api/order/status chỉ update 'status'. 
      // Tuy nhiên, để test UI phản hồi là đủ.

      toast.info(`🛠 Simulated: ${lalamoveStatus} -> ${myStatus}`);
      await fetchAllOrder();
    } catch (error) {
      toast.error("Simulation failed");
    }
  }

  // -----------------------------

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
                  <b className="price">{order.amount.toLocaleString()} ₫</b>
                </div>
              </div>

              <div className="order-controls">
                {/* Hiển thị thông tin vận chuyển nếu đã gọi xe */}
                {order.deliveryId && (
                  <div className="delivery-info" style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    <p>🚚 Lalamove ID: <b>{order.deliveryId}</b></p>
                    <p>Status: {order.deliveryStatus || "Processing"}</p>
                  </div>
                )}

                <div className="order-status-control">
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className={`status-select ${order.status.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Food Processing">Food Processing</option>
                    <option value="Finding Driver">Finding Driver</option>
                    <option value="Out for delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Nút gọi Lalamove chỉ hiện khi đơn chưa hoàn thành VÀ chưa gọi xe */}
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && !order.deliveryId && (
                  <button
                    className="btn-lalamove"
                    onClick={() => handleLalamoveRequest(order)}
                    disabled={loadingDelivery}
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#ff6600', /* Lalamove Orange */
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <Truck size={16} />
                    {loadingDelivery ? "Đang xử lý..." : "Gọi Lalamove"}
                  </button>
                )}

                {/* --- DEV TOOLS: SIMULATE LALAMOVE STATUS --- */}
                {order.deliveryId && (
                  <div className="dev-tools" style={{ marginTop: '10px', borderTop: '1px dashed #ccc', paddingTop: '5px' }}>
                    <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>🛠 TEST LALAMOVE STATUS:</p>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <button onClick={() => simulateLalamove(order._id, 'ASSIGNING_DRIVER')} style={devBtnStyle}>Assigning</button>
                      <button onClick={() => simulateLalamove(order._id, 'ON_GOING')} style={devBtnStyle}>On Going</button>
                      <button onClick={() => simulateLalamove(order._id, 'COMPLETED')} style={{ ...devBtnStyle, backgroundColor: '#d1fae5', color: '#065f46' }}>Done</button>
                      <button onClick={() => simulateLalamove(order._id, 'CANCELED')} style={{ ...devBtnStyle, backgroundColor: '#fee2e2', color: '#991b1b' }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const devBtnStyle = {
  padding: '4px 6px',
  fontSize: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: '#f3f4f6'
};

export default Orders;