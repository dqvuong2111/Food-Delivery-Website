import React, { useContext, useEffect, useState } from 'react'
import './Feedback.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { assets } from '../../assets/assets'

const Feedback = () => {

    const { url } = useContext(StoreContext);
    const [reviews, setReviews] = useState([]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(url + "/api/review/all");
            if (response.data.success) {
                setReviews(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    }

    useEffect(() => {
        fetchReviews();
    }, [])

    if (reviews.length === 0) return null;

    return (
        <div className='feedback' id='feedback'>
            <h2>What our customers say</h2>
            <div className="feedback-list">
                {reviews.map((review, index) => {
                    return (
                        <div key={index} className="feedback-item">
                            <div className="feedback-header">
                                <img src={url + "/images/" + review.foodImage} alt={review.foodName} onError={(e) => { e.target.src = assets.logo }} />
                                <div className="feedback-info">
                                    <h4>Guest User</h4> {/* don't have user names stored in review currently */}
                                    <p>Ordered: {review.foodName}</p>
                                </div>
                            </div>
                            <div className="feedback-stars">
                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </div>
                            <p className="feedback-comment">"{review.comment}"</p>
                            <span className="feedback-date">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Feedback
