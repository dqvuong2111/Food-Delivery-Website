import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className='footer-content'>

                <div className="footer-content-left">
                    <img src={assets.logo} alt="" />
                    <p> Welcome to our website! We are passionate about providing fresh, delicious meals straight to your doorstep. Our mission is to combine convenience with exceptional taste, ensuring every order delights our customers. We value quality, reliability, and your satisfaction above all</p>
                    
                    <div className="footer-social-icon">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.x_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>


                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>

                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+8488888888</li>
                        <li>contact@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">NoCopyright ©</p>
        </div>
    )
}

export default Footer
