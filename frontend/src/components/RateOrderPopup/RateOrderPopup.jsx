import React, { useContext, useState } from 'react'
import './RateOrderPopup.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'
import axios from 'axios'

const RateOrderPopup = ({ setShowRatePopup, orderItems }) => {
    const { url, token } = useContext(StoreContext);
    const [ratings, setRatings] = useState({}); // { itemId: rating }
    const [comments, setComments] = useState({}); // { itemId: comment }

    const handleRating = (itemId, rating) => {
        setRatings(prev => ({...prev, [itemId]: rating}));
    }

    const handleComment = (itemId, comment) => {
        setComments(prev => ({...prev, [itemId]: comment}));
    }

    const submitReviews = async () => {
        try {
            for (const item of orderItems) {
                if (ratings[item._id]) {
                    await axios.post(url + "/api/review/add", {
                        foodId: item._id,
                        rating: ratings[item._id],
                        comment: comments[item._id] || ""
                    }, { headers: { token } });
                }
            }
            alert("Reviews submitted!");
            setShowRatePopup(false);
        } catch (error) {
            console.error(error);
            alert("Error submitting reviews");
        }
    }

    return (
        <div className='rate-popup'>
            <div className="rate-popup-container">
                <div className="rate-popup-header">
                    <h2>Rate your Order</h2>
                    <img onClick={() => setShowRatePopup(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="rate-items-list">
                    {orderItems.map((item, index) => (
                        <div key={index} className="rate-item">
                            <p className='item-name'>{item.name}</p>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span 
                                        key={star} 
                                        className={ratings[item._id] >= star ? "star filled" : "star"}
                                        onClick={() => handleRating(item._id, star)}
                                    >★</span>
                                ))}
                            </div>
                            <textarea 
                                placeholder='Write a review...' 
                                onChange={(e) => handleComment(item._id, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <button onClick={submitReviews}>Submit Reviews</button>
            </div>
        </div>
    )
}

export default RateOrderPopup
