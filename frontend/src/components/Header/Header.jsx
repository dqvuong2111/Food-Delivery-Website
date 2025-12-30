import React, { useState, useEffect } from 'react'
import './Header.css'
import axios from 'axios'

const Header = () => {
    const [banners, setBanners] = useState(['/header_img.png']); // Default fallback
    const [currentBg, setCurrentBg] = useState(0);
    const url = "http://localhost:4000";

    const fetchBanners = async () => {
        try {
            const response = await axios.get(`${url}/api/banner/list`);
            if (response.data.success && response.data.data.length > 0) {
                // Map backend images to full URLs
                const bannerImages = response.data.data.map(item => item.image);
                setBanners(bannerImages);
            }
        } catch (error) {
            console.error("Error fetching banners:", error);
        }
    }

    useEffect(() => {
        fetchBanners();
    }, []);

    const nextSlide = () => {
        setCurrentBg((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentBg((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % banners.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [banners.length]);

  return (
    <div className='header'>
      {banners.map((bg, index) => (
        <div 
          key={index}
          className={`header-slide ${index === currentBg ? 'active' : ''}`}
          style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${bg})` }}
        ></div>
      ))}
      <div className="header-arrow header-arrow-left" onClick={prevSlide}>&#10094;</div>
      <div className="header-contents">
        <h2 data-aos="fade-up" data-aos-delay="200">Order your favourite food here</h2>
        <p data-aos="fade-up" data-aos-delay="400">Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
        <a href='#explore-menu'><button data-aos="fade-up" data-aos-delay="600">View Menu</button></a>
      </div>
      <div className="header-arrow header-arrow-right" onClick={nextSlide}>&#10095;</div>
    </div>
  )
}

export default Header
