import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

const Dashboard = ({ url }) => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalFoodItems: 0,
        totalUsers: 0,
        totalRevenue: 0,
        topItems: []
    });

    const fetchStats = async () => {
        const response = await axios.get(url + "/api/dashboard/stats");
        if (response.data.success) {
            setStats(response.data.data);
        }
    }

    useEffect(() => {
        fetchStats();
    }, [])

    const statCards = [
        {
            title: 'Total Revenue',
            value: `${stats.totalRevenue.toLocaleString()} ₫`,
            icon: DollarSign,
            color: '#10b981',
            bgColor: '#ecfdf5',
            trend: '+12%'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: '#6366f1',
            bgColor: '#eef2ff',
            trend: '+8%'
        },
        {
            title: 'Food Items',
            value: stats.totalFoodItems,
            icon: Package,
            color: '#f59e0b',
            bgColor: '#fffbeb',
            trend: '+3'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: '#ec4899',
            bgColor: '#fdf2f8',
            trend: '+15%'
        }
    ];

    return (
        <div className='dashboard-page'>
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's what's happening today.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                            <stat.icon size={22} color={stat.color} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-title">{stat.title}</span>
                            <h3 className="stat-value">{stat.value}</h3>
                        </div>
                        <div className="stat-trend" style={{ color: stat.color }}>
                            <TrendingUp size={14} />
                            <span>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="dashboard-charts">
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3>Top Selling Items</h3>
                            <p>Most popular items this month</p>
                        </div>
                        <button className="view-all-btn">
                            View All <ArrowUpRight size={14} />
                        </button>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.topItems} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    axisLine={{ stroke: '#e2e8f0' }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    axisLine={{ stroke: '#e2e8f0' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="url(#colorGradient)"
                                    name="Units Sold"
                                    radius={[6, 6, 0, 0]}
                                />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#a5b4fc" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
