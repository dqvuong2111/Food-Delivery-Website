import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header' data-aos="zoom-in" data-aos-duration="1500">
      <div className="header-contents">
        <h2 data-aos="fade-up" data-aos-delay="200">Order your favourite food here</h2>
        <p data-aos="fade-up" data-aos-delay="400">Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
        <button data-aos="fade-up" data-aos-delay="600">View Menu</button>
      </div>
    </div>
  )
}

export default Header
