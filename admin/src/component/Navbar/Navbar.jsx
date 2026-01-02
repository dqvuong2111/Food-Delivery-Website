import React, { useState, useEffect, useRef } from "react"
import "./Navbar.css"
import { assets } from "../../assets/assets"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Bell, LogOut, Package, Clock, ChevronRight } from "lucide-react"

const Navbar = ({ url, setToken }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const firstLoad = useRef(true);
    const previousCount = useRef(0);

    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!url) return;
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const response = await axios.get(url + "/api/order/list", { headers: { token } });
                if (response.data.success) {
                    const allOrders = response.data.data;
                    const unreadOrders = allOrders.filter(order => !order.isRead).reverse();
                    setNotifications(unreadOrders);

                    if (firstLoad.current) {
                        previousCount.current = unreadOrders.length;
                        firstLoad.current = false;
                    } else {
                        if (unreadOrders.length > previousCount.current) {
                            toast.info(`🔔 You have ${unreadOrders.length - previousCount.current} new order(s)!`);
                        }
                        previousCount.current = unreadOrders.length;
                    }
                }
            } catch (error) { }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [url]);

    const handleNotificationClick = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(url + "/api/order/mark-read", { orderId }, { headers: { token } });
            if (response.data.success) {
                setNotifications(prev => prev.filter(n => n._id !== orderId));
                setShowDropdown(false);
                navigate('/orders');
            }
        } catch (error) { }
    }

    const handleViewAll = async () => {
        try {
            const token = localStorage.getItem("token");
            const markReadPromises = notifications.map(order =>
                axios.post(url + "/api/order/mark-read", { orderId: order._id }, { headers: { token } })
            );
            await Promise.all(markReadPromises);
            setNotifications([]);
            setShowDropdown(false);
            navigate('/orders');
        } catch (error) { }
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }

    const formatTimeAgo = (date) => {
        const now = new Date();
        const orderDate = new Date(date);
        const diffMs = now - orderDate;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return `${Math.floor(diffMins / 1440)}d ago`;
    }

    return (
        <div className="navbar">
            <div className="navbar-left">
                <img className="logo" src={assets.logo} alt="" />
                <h3 className="navbar-brand-text">Admin Panel</h3>
            </div>

            <div className="navbar-right">
                {/* Bell Icon */}
                <div className="notification-wrapper" ref={dropdownRef}>
                    <button
                        className={`bell-button ${notifications.length > 0 ? 'has-notifications' : ''}`}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && (
                            <span className="notification-badge">
                                {notifications.length > 9 ? '9+' : notifications.length}
                            </span>
                        )}
                        {notifications.length > 0 && <span className="pulse-ring"></span>}
                    </button>

                    {showDropdown && (
                        <div className="notification-panel">
                            <div className="panel-header">
                                <div className="header-left">
                                    <Bell size={18} />
                                    <span>Notifications</span>
                                </div>
                                {notifications.length > 0 && (
                                    <span className="new-count">{notifications.length} new</span>
                                )}
                            </div>

                            <div className="panel-body">
                                {notifications.length === 0 ? (
                                    <div className="empty-notifications">
                                        <Bell size={40} strokeWidth={1} />
                                        <p>No new notifications</p>
                                        <span>You're all caught up!</span>
                                    </div>
                                ) : (
                                    notifications.slice(0, 5).map((order, index) => (
                                        <div
                                            key={index}
                                            className="notification-item"
                                            onClick={() => handleNotificationClick(order._id)}
                                        >
                                            <div className="item-icon">
                                                <Package size={18} />
                                            </div>
                                            <div className="item-content">
                                                <div className="item-header">
                                                    <span className="order-id">Order #{order._id.slice(-4).toUpperCase()}</span>
                                                    <span className="item-time">
                                                        <Clock size={12} />
                                                        {formatTimeAgo(order.date)}
                                                    </span>
                                                </div>
                                                <p className="item-details">
                                                    {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.amount.toLocaleString()} ₫
                                                </p>
                                            </div>
                                            <ChevronRight size={16} className="item-arrow" />
                                        </div>
                                    ))
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <div className="panel-footer" onClick={handleViewAll}>
                                    View All Orders
                                    <ChevronRight size={16} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="profile-container" ref={profileRef} onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                    <img className='profile' src={assets.profile_image} alt="" />
                    {showProfileDropdown && (
                        <div className="profile-dropdown">
                            <li onClick={logout}>
                                <LogOut size={18} />
                                Logout
                            </li>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar