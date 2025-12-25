import React, { useState, useEffect } from 'react'
import './Coupons.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Coupons = ({url}) => {
    const [coupons, setCoupons] = useState([]);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discountPercentage: ""
    });

    const fetchCoupons = async () => {
        const response = await axios.get(`${url}/api/coupon/list`);
        if(response.data.success) {
            setCoupons(response.data.data);
        } else {
            toast.error("Error fetching coupons");
        }
    }

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setNewCoupon(data => ({...data, [name]: value}));
    }

    const onAddCoupon = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/coupon/add`, newCoupon, {headers: {token}});
        if(response.data.success) {
            setNewCoupon({code: "", discountPercentage: ""});
            fetchCoupons();
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    }

    const removeCoupon = async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/coupon/remove`, {id}, {headers: {token}});
        if(response.data.success) {
            fetchCoupons();
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    }

    useEffect(() => {
        fetchCoupons();
    }, [])

    return (
        <div className='coupons add flex-col'>
            <h3>Manage Coupons</h3>
            
            <form className='flex-col' onSubmit={onAddCoupon}>
                <div className="add-coupon-group">
                    <p>Coupon Code</p>
                    <input onChange={onChangeHandler} value={newCoupon.code} type="text" name='code' placeholder='e.g. SAVE20' required />
                </div>
                <div className="add-coupon-group">
                    <p>Discount Percentage (%)</p>
                    <input onChange={onChangeHandler} value={newCoupon.discountPercentage} type="number" name='discountPercentage' placeholder='20' required />
                </div>
                <button type='submit' className='add-btn'>Add Coupon</button>
            </form>

            <div className="coupon-list">
                <h4>Active Coupons</h4>
                <div className="coupon-table-format title">
                    <b>Code</b>
                    <b>Discount</b>
                    <b>Status</b>
                    <b>Action</b>
                </div>
                {coupons.map((item, index) => {
                    return (
                        <div key={index} className="coupon-table-format">
                            <p>{item.code}</p>
                            <p>{item.discountPercentage}%</p>
                            <p className='active-status'>Active</p>
                            <p onClick={() => removeCoupon(item._id)} className='cursor'>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Coupons