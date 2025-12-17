import React, { useState } from 'react'
import './MyOrders.css'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useEffect } from 'react';
import { assets } from '../../assets/assets';
import RateOrderPopup from '../../components/RateOrderPopup/RateOrderPopup';

const MyOrders = () => {

    const {url, token} = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [showRatePopup, setShowRatePopup] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(url+"/api/order/userorders", {}, {headers:{token}});
        setData(response.data.data);
    }

    const handleRate = (items) => {
        setSelectedOrderItems(items);
        setShowRatePopup(true);
    }

    useEffect(() => {
        if(token) {
            fetchOrders();
        }
    }, [token])

    const getStatusStep = (status) => {
        const steps = ["Food Processing", "Out for delivery", "Delivered"];
        const index = steps.indexOf(status);
        return index === -1 ? 0 : index + 1;
    }

    return (
        <div className='my-orders'>
            {showRatePopup && <RateOrderPopup setShowRatePopup={setShowRatePopup} orderItems={selectedOrderItems} />}
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => {
                    const currentStep = getStatusStep(order.status);
                    return (
                        <div key={index} className="my-orders-order">
                            <div className="order-header-info">
                                <img src={assets.parcel_icon} alt="" />
                                <p>{order.items.map((item, idx) => {
                                    if(idx === order.items.length-1) {
                                        return item.name+" x "+item.quantity
                                    }
                                    else{
                                        return item.name+" x "+item.quantity+", "                                    
                                    }
                                })}</p>
                            </div>
                            
                            <div className="order-details-grid">
                                <p className="price">${order.amount}.00</p>
                                <p>Items: {order.items.length}</p>
                            </div>

                            <div className="order-tracker">
                                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                                    <div className="step-circle">1</div>
                                    <span>Processing</span>
                                </div>
                                <div className={`line ${currentStep >= 2 ? 'active' : ''}`}></div>
                                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                                    <div className="step-circle">2</div>
                                    <span>Out for Delivery</span>
                                </div>
                                <div className={`line ${currentStep >= 3 ? 'active' : ''}`}></div>
                                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                                    <div className="step-circle">3</div>
                                    <span>Delivered</span>
                                </div>
                            </div>
                            
                            <div className="order-actions">
                                <button onClick={fetchOrders} className="track-btn">Refresh Status</button>
                                {order.status === 'Delivered' && (
                                    <button onClick={() => handleRate(order.items)} className="rate-btn">Rate Order</button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyOrders