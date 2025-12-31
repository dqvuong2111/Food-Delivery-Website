import React from 'react'
import './EmptyState.css'
import { useNavigate } from 'react-router-dom'

const EmptyState = ({ image, title, message, btnText, btnPath }) => {
    const navigate = useNavigate();

    return (
        <div className='empty-state'>
            <div className="empty-state-img-container">
                <img src={image} alt="" />
            </div>
            <h3>{title}</h3>
            <p>{message}</p>
            {btnText && (
                <button onClick={() => navigate(btnPath || '/')}>
                    {btnText}
                </button>
            )}
        </div>
    )
}

export default EmptyState
