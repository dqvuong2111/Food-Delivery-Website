import React, { useEffect, useState } from 'react'
import './Coupons.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Coupons = ({url}) => {
    const [list, setList] = useState([]);
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");

    const fetchList = async () => {
        const response = await axios.get(`${url}/api/coupon/list`);
        if(response.data.success) {
            setList(response.data.data);
        } else {
            toast.error("Error fetching coupons");
        }
    }

    const addCoupon = async (e) => {
        e.preventDefault();
        const response = await axios.post(`${url}/api/coupon/add`, {
            code,
            discountPercentage: Number(discount)
        });
        if(response.data.success) {
            toast.success(response.data.message);
            setCode("");
            setDiscount("");
            fetchList();
        } else {
            toast.error(response.data.message);
        }
    }

    const removeCoupon = async (id) => {
        const response = await axios.post(`${url}/api/coupon/remove`, {id});
        if(response.data.success) {
            toast.success(response.data.message);
            fetchList();
        } else {
            toast.error("Error");
        }
    }

    useEffect(() => {
        fetchList();
    }, [])

  return (
    <div className='coupons add flex-col' data-aos="fade-up">
        <h3>Manage Coupons</h3>
        <form className='coupon-form' onSubmit={addCoupon}>
            <input type="text" placeholder='Coupon Code (e.g., SALE20)' value={code} onChange={(e)=>setCode(e.target.value)} required />
            <input type="number" placeholder='Discount %' value={discount} onChange={(e)=>setDiscount(e.target.value)} required />
            <button type='submit' className='btn-primary'>Add Coupon</button>
        </form>

        <div className="coupon-list">
            <div className="list-table">
                <b>Code</b>
                <b>Discount</b>
                <b>Status</b>
                <b>Action</b>
            </div>
            {list.map((item, index) => (
                <div key={index} className="list-table-format">
                    <p>{item.code}</p>
                    <p>{item.discountPercentage}%</p>
                    <p className='status-active'>Active</p>
                    <p onClick={()=>removeCoupon(item._id)} className='cursor'>X</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Coupons
