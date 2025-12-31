import React, { useContext } from 'react'
import './StoreInfo.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'

const StoreInfo = () => {
    const { settings } = useContext(StoreContext);

    if (!settings) return null;

    return (
        <div className='store-info'>
            {settings.isStoreOpen ? (
                 <div className="store-status-badge open">
                    <span>🟢 Open Now</span>
                 </div>
            ) : (
                <div className="store-closed-banner">
                    <p>🔴 We are currently closed. You can still browse, but orders will be processed when we open.</p>
                </div>
            )}
            
            <div className="store-info-container">
                <div className="info-item">
                    <div className="info-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                    </div>
                    <div className="info-text">
                        <span>Delivery Fee</span>
                        <p>Distance Based</p>
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div className="info-text">
                        <span>Est. Time</span>
                        <p>{settings.estimatedDeliveryTime}</p>
                    </div>
                </div>

                <div className="info-item">
                     <div className="info-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                    </div>
                    <div className="info-text">
                        <span>Tax Rate</span>
                        <p>{settings.taxRate}%</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreInfo