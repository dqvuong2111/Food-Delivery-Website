import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className='footer' id='footer'>
            <div className='footer-content'>

                <div className="footer-content-left" data-aos="fade-up">
                    <img src={assets.logo} alt="" className='footer-logo' />
                    <p> Welcome to our website! We are passionate about providing fresh, delicious meals straight to your doorstep. Our mission is to combine convenience with exceptional taste, ensuring every order delights our customers. We value quality, reliability, and your satisfaction above all</p>
                    
                    <div className="footer-social-icon">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.x_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>


                <div className="footer-content-center" data-aos="fade-up" data-aos-delay="200">
                    <h2>COMPANY</h2>
                    <ul>
                        <li onClick={()=>navigate('/')}>Home</li>
                        <li onClick={()=>navigate('/about')}>About us</li>
                        <li onClick={()=>navigate('/delivery')}>Delivery</li>
                        <li onClick={()=>navigate('/privacy')}>Privacy policy</li>
                    </ul>
                </div>

                <div className="footer-content-right" data-aos="fade-up" data-aos-delay="400">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+8488888888</li>
                        <li>bkfood6696@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">NoCopyright ©</p>
        </div>
    )
}

export default Footer
