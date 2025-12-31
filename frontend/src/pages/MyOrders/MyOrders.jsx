import React, { useState } from 'react'
import './MyOrders.css'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useEffect } from 'react';
import { assets } from '../../assets/assets';
import RateOrderPopup from '../../components/RateOrderPopup/RateOrderPopup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/EmptyState/EmptyState';

const MyOrders = () => {

    const { url, token, addToCart } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [showRatePopup, setShowRatePopup] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            if (response.data.success) {
                setData(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    const handleRefreshStatus = async (order) => {
        if (order.deliveryId) {
            try {
                await axios.post(url + "/api/delivery/status",
                    { deliveryId: order.deliveryId, orderId: order._id },
                    { headers: { token } }
                );
                toast.success("Status updated");
            } catch (error) {
                console.error("Sync failed", error);
            }
        }
        await fetchOrders();
    }

    const handleRate = (items) => {
        setSelectedOrderItems(items);
        setShowRatePopup(true);
    }

    const handleReorder = async (order) => {
        if (order.status === "Cancelled") {
            // Direct to menu to choose new dishes
            navigate('/');
            window.scrollTo(0, 0);
        } else {
            // Delivered: Add old items to cart
            for (const item of order.items) {
                for (let i = 0; i < item.quantity; i++) {
                    await addToCart(item._id);
                }
            }
            toast.success("Items added to cart!");
            navigate('/cart'); // Optional: redirect to cart for convenience
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
            // Poll for updates every 5 seconds
            const interval = setInterval(() => {
                fetchOrders();
            }, 5000);

            // Clean up interval on unmount
            return () => clearInterval(interval);
        }
    }, [token])

    // Scroll to top only on mount, not on every token change (to prevent annoying jumps during polls if token re-evaluates)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const getStatusStep = (status) => {
        if (status === "Cancelled") return -1;
        const statusMap = {
            "Pending": 1,
            "Confirmed": 2,
            "Food Processing": 3,
            "Processing": 3, // Support legacy status
            "Finding Driver": 4,
            "Out for delivery": 5,
            "Delivered": 6
        };
        return statusMap[status] || 0;
    }

    return (
        <div className='my-orders'>
            {showRatePopup && <RateOrderPopup setShowRatePopup={setShowRatePopup} orderItems={selectedOrderItems} />}
            <h2>My Orders</h2>
            <div className="container">
                {data.length === 0 ? (
                    <EmptyState
                        image={assets.parcel_icon}
                        title="No orders yet"
                        message="You haven't placed any orders yet. Go to the menu to satisfy your hunger!"
                        btnText="Browse Menu"
                        btnPath="/"
                    />
                ) : (
                    data.map((order, index) => {
                        const currentStep = getStatusStep(order.status);
                        return (
                            <div key={index} className={`my-orders-order ${order.status === 'Cancelled' ? 'cancelled-order' : ''}`}>
                                <div className="order-header-info">
                                    <img src={assets.parcel_icon} alt="" />
                                    <p>{order.items.map((item, idx) => {
                                        if (idx === order.items.length - 1) {
                                            return item.name + " x " + item.quantity
                                        }
                                        else {
                                            return item.name + " x " + item.quantity + ", "
                                        }
                                    })}</p>
                                </div>

                                <div className="order-details-grid">
                                    <p className="price">{order.amount.toLocaleString()} ₫</p>
                                    <p>Items: {order.items.length}</p>
                                </div>

                                <p className="order-status-text">Status: <b>{order.status}</b></p>

                                {order.status === 'Cancelled' ? (
                                    <div className="order-cancelled-banner">
                                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>❌ Order Cancelled</p>
                                        <p style={{ fontSize: '13px' }}>Reason: {order.cancellationReason || "No reason provided"}</p>
                                    </div>
                                ) : (
                                    <div className="order-tracker">
                                        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                                            <div className="step-circle">1</div>
                                            <span>Pending</span>
                                        </div>
                                        <div className={`line ${currentStep >= 2 ? 'active' : ''}`}></div>
                                        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                                            <div className="step-circle">2</div>
                                            <span>Confirmed</span>
                                        </div>
                                        <div className={`line ${currentStep >= 3 ? 'active' : ''}`}></div>
                                        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                                            <div className="step-circle">3</div>
                                            <span>Processing</span>
                                        </div>
                                        <div className={`line ${currentStep >= 4 ? 'active' : ''}`}></div>
                                        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
                                            <div className="step-circle">4</div>
                                            <span>Finding Driver</span>
                                        </div>
                                        <div className={`line ${currentStep >= 5 ? 'active' : ''}`}></div>
                                        <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>
                                            <div className="step-circle">5</div>
                                            <span>On Way</span>
                                        </div>
                                        <div className={`line ${currentStep >= 6 ? 'active' : ''}`}></div>
                                        <div className={`step ${currentStep >= 6 ? 'active' : ''}`}>
                                            <div className="step-circle">6</div>
                                            <span>Delivered</span>
                                        </div>
                                    </div>
                                )}

                                <div className="order-actions">
                                    <button onClick={() => handleRefreshStatus(order)} className="track-btn">Refresh Status</button>
                                    {order.status === 'Delivered' && (
                                        <button onClick={() => handleRate(order.items)} className="rate-btn">Rate Order</button>
                                    )}
                                    {(order.status === 'Cancelled' || order.status === 'Delivered') && (
                                        <button onClick={() => handleReorder(order)} className="reorder-btn">
                                            {order.status === 'Cancelled' ? "Choose New Dishes" : "Reorder"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default MyOrders