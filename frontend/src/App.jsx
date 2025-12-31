import React, { useState, useEffect, useContext } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import About from './pages/About/About'
import Delivery from './pages/Delivery/Delivery'
import Privacy from './pages/Privacy/Privacy'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { StoreContext } from './context/StoreContext'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Profile from './pages/Profile/Profile'
import Wishlist from './pages/Wishlist/Wishlist'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import ChatWidget from './components/ChatWidget/ChatWidget'

const App = () => {

  const { showLogin, setShowLogin } = useContext(StoreContext);

  useEffect(() => {
    AOS.init({
      duration: 600,
      offset: 20,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  return (
    <>
      <ScrollToTop />
      {showLogin ? <LoginPopup /> : <></>}
      <div className='app'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/about' element={<About />} />
          <Route path='/delivery' element={<Delivery />} />
          <Route path='/privacy' element={<Privacy />} />
        </Routes>
      </div>
      <Footer />
      <ChatWidget />
    </>
  )
}

export default App
