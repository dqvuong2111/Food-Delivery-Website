import React from 'react'
import './Delivery.css'

const Delivery = () => {
  return (
    <div className='delivery-page'>
      <h1>Delivery Information</h1>
      
      <div className="delivery-sections">
        <div className="delivery-card">
            <h2>Delivery Areas</h2>
            <p>We currently deliver to the entire metropolitan area and select suburbs. Enter your zip code on the checkout page to check if we deliver to your location.</p>
        </div>

        <div className="delivery-card">
            <h2>Estimated Delivery Time</h2>
            <p>Standard delivery takes 30-45 minutes. During peak hours (12 PM - 2 PM and 7 PM - 9 PM), delivery times may vary slightly. You can track your order in real-time from the "My Orders" page.</p>
        </div>

        <div className="delivery-card">
            <h2>Delivery Fees</h2>
            <p>Our delivery fees are calculated based on the distance from our store to your location. The exact fee will be displayed at checkout before you pay.</p>
        </div>
      </div>
    </div>
  )
}

export default Delivery
