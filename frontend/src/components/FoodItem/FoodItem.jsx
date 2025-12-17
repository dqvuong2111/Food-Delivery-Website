import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id, name, price, description, image, rating, reviews}) => {

    const { url, addToCart, removeFromCart, cartItems } = useContext(StoreContext);
    const count = cartItems[id] || 0;
  
    return (
        <div className='food-item' data-aos="fade-up">
            <div className="food-item-img-container">
                <img className='food-item-image' src={url+"/images/"+image} alt="" />
            </div>
            
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <div className="rating-container">
                        <img src={assets.rating_starts} alt="" className="stars-hidden" /> {/* Keep for layout or replace */}
                        <div className="dynamic-rating">
                            <span className="star">★</span>
                            <span>{rating > 0 ? rating : "New"}</span>
                            {reviews > 0 && <span className="review-count">({reviews})</span>}
                        </div>
                    </div>
                </div>
                <p className="food-item-desc">{description}</p>
                
                <div className="food-item-action">
                    <p className="food-item-price">${price}</p>
                    {count === 0 ? (
                        <button className="food-item-add-btn" onClick={() => addToCart(id)}>
                            Add to Cart
                        </button>
                    ) : (
                        <div className="food-item-counter-simple">
                            <span className="counter-btn-minus" onClick={() => removeFromCart(id)}>-</span>
                            <span>{count}</span>
                            <span className="counter-btn-plus" onClick={() => addToCart(id)}>+</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FoodItem
