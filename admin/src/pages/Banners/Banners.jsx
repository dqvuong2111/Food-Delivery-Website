import React, { useState, useEffect } from 'react'
import './Banners.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const Banners = ({url}) => {
    const [image, setImage] = useState(false);
    const [banners, setBanners] = useState([]);

    const fetchBanners = async () => {
        const response = await axios.get(`${url}/api/banner/list`);
        if(response.data.success) {
            setBanners(response.data.data);
        } else {
            toast.error("Error fetching banners");
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);
        
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/banner/add`, formData, {headers: {token}});
        if(response.data.success) {
            setImage(false);
            fetchBanners();
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    }

    const removeBanner = async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/banner/remove`, {id}, {headers: {token}});
        if(response.data.success) {
            fetchBanners();
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    }

    useEffect(() => {
        fetchBanners();
    }, [])

    return (
        <div className='banners add flex-col'>
            <h3>Manage Banners</h3>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Banner Image</p>
                    <label htmlFor="image" className={image ? "upload-area has-image" : "upload-area"}>
                         {image ? (
                            <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />
                        ) : (
                            <div className="upload-instructions">
                                <div className="upload-circle">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                </div>
                                <span className="upload-text-main">Click or drag banner here</span>
                                <span className="upload-text-sub">Recommended: 1200x400 (3:1 ratio)</span>
                                <div className="upload-button-mock">Choose Banner</div>
                            </div>
                        )}
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>
                <button type='submit' className='add-btn'>Add Banner</button>
            </form>

            <div className="banner-list">
                <h4>Active Banners</h4>
                <div className="banner-grid">
                    {banners.map((item, index) => {
                        return (
                            <div key={index} className="banner-item">
                                <img src={`${url}/images/${item.image}`} alt="" />
                                <div className="banner-actions">
                                    <p onClick={() => removeBanner(item._id)} className='cursor'>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Banners
