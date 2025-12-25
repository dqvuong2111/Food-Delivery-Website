import React, { useState, useEffect, useRef } from "react"
import "./Navbar.css"
import {assets} from "../../assets/assets"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Navbar = ({url, setToken}) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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
            const response = await axios.get(url + "/api/order/list", {headers: {token}});
            if (response.data.success) {
                const allOrders = response.data.data;
                const unreadOrders = allOrders.filter(order => !order.isRead).reverse();
                setNotifications(unreadOrders);
            }
        } catch (error) {}
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [url]);

  const handleNotificationClick = async (orderId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(url + "/api/order/mark-read", { orderId }, {headers: {token}});
        if (response.data.success) {
            setNotifications(prev => prev.filter(n => n._id !== orderId));
            setShowDropdown(false);
            navigate('/orders');
        }
    } catch (error) {}
  }

  const handleViewAll = async () => {
    try {
        const token = localStorage.getItem("token");
        const markReadPromises = notifications.map(order => 
            axios.post(url + "/api/order/mark-read", { orderId: order._id }, {headers: {token}})
        );
        await Promise.all(markReadPromises);
        setNotifications([]);
        setShowDropdown(false);
        navigate('/orders');
    } catch (error) {}
  }

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  return (
    <div className="navbar">
        <div className="navbar-left">
            <img className="logo" src={assets.logo} alt=""/>
            <h3 className="navbar-brand-text">Admin Panel</h3>
        </div>
        
        <div className="navbar-right">
            <div className="notification-wrapper" ref={dropdownRef}>
                <div className="notification-icon" onClick={() => setShowDropdown(!showDropdown)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
                </div>

                {showDropdown && (
                    <div className="notification-dropdown">
                        <div className="dropdown-header">
                            <p>Notifications</p>
                            <span className="count">{notifications.length} New</span>
                        </div>
                        <div className="dropdown-body">
                            {notifications.length === 0 ? (
                                <p className="no-notif">No new orders</p>
                            ) : (
                                notifications.slice(0, 5).map((order, index) => (
                                    <div key={index} className="notif-item" onClick={() => handleNotificationClick(order._id)}>
                                        <div className="notif-dot"></div>
                                        <div className="notif-content">
                                            <p className="notif-title">New Order #{order._id.slice(-4)}</p>
                                            <p className="notif-desc">
                                                {order.items.length} items • ${order.amount}
                                            </p>
                                            <p className="notif-time">
                                                {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {notifications.length > 0 && (
                             <div className="dropdown-footer" onClick={handleViewAll}>
                                View All Orders
                             </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className="profile-container" ref={profileRef} onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                <img className='profile' src={assets.profile_image} alt=""/>
                {showProfileDropdown && (
                    <div className="profile-dropdown">
                        <li onClick={logout}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
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