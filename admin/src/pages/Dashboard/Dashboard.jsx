import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'

const Dashboard = ({url}) => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalFoodItems: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: []
    });

    const fetchStats = async () => {
        const response = await axios.get(url+"/api/dashboard/stats");
        if(response.data.success) {
            setStats(response.data.data);
        }
    }

    useEffect(() => {
        fetchStats();
    }, [])

    return (
        <div className='dashboard add flex-col'> {/* Using 'add' class for consistent styling */}
            <h3>Admin Dashboard</h3>
            <div className="dashboard-content-wrapper"> {/* New wrapper for max-width */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>Total Revenue</h4>
                        <p>${stats.totalRevenue}</p>
                    </div>

                <div className="stat-card">
                    <h4>Total Orders</h4>
                    <p>{stats.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h4>Food Items</h4>
                    <p>{stats.totalFoodItems}</p>
                </div>
                <div className="stat-card">
                    <h4>Total Users</h4>
                    <p>{stats.totalUsers}</p>
                </div>
            </div>

            <div className="recent-orders">
                <h4>Recent Orders</h4>
                <div className="recent-list">
                    {stats.recentOrders.map((order, index) => (
                        <div key={index} className="recent-item">
                            <p><b>Order ID:</b> {order._id.slice(-6)}</p>
                            <p><b>Amount:</b> ${order.amount}</p>
                            <p className={`status ${order.status === 'Delivered' ? 'delivered' : 'pending'}`}>{order.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    )
}

export default Dashboard
