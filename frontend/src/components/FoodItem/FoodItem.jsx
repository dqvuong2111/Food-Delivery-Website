import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image, rating, reviews, available = true, delay }) => {

    const { url, addToCart, removeFromCart, cartItems, wishlist, addToWishlist, removeFromWishlist } = useContext(StoreContext);
    const count = cartItems[id] || 0;
    const isWishlisted = wishlist[id];
    const isSoldOut = available === false;

    const toggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(id);
        } else {
            addToWishlist(id);
        }
    }

    return (
        <div className={`food-item ${isSoldOut ? 'sold-out' : ''}`} data-aos="fade-up" data-aos-delay={delay}>
            <div className="food-item-img-container">
                <img className='food-item-image' src={image.startsWith("http") ? image : url + "/images/" + image} alt="" />
                {isSoldOut && <div className="sold-out-overlay"><span>Sold Out</span></div>}
                <div className="wishlist-icon" onClick={toggleWishlist}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? "tomato" : "white"} stroke="tomato" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
            </div>

            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <div className="rating-container">
                        <img src={assets.rating_starts} alt="" className="stars-hidden" />
                        <div className="dynamic-rating">
                            <span className="star">★</span>
                            <span>{rating > 0 ? rating : "New"}</span>
                            {reviews > 0 && <span className="review-count">({reviews})</span>}
                        </div>
                    </div>
                </div>
                <p className="food-item-desc">{description}</p>

                <div className="food-item-action">
                    <p className="food-item-price">{price.toLocaleString()} ₫</p>
                    {isSoldOut ? (
                        <button className="food-item-add-btn sold-out-btn" disabled>
                            Sold Out
                        </button>
                    ) : count === 0 ? (
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
