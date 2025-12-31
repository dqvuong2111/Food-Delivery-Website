import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = ({url}) => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalFoodItems: 0,
        totalUsers: 0,
        totalRevenue: 0,
        topItems: []
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
        <div className='dashboard add flex-col'>
            <h3>Admin Dashboard</h3>
            <div className="dashboard-content-wrapper">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>Total Revenue</h4>
                        <p>{stats.totalRevenue.toLocaleString()} ₫</p>
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

                <div className="dashboard-charts">
                    <div className="chart-container">
                        <h4>Top Selling Items</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.topItems} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="tomato" name="Units Sold" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
