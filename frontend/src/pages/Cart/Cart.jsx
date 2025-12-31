import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../../assets/assets";

const Cart = () => {
  const { cartItems, food_list, deleteItemFromCart, getTotalCartAmount, url, discount, setDiscount, getFinalAmount, token, setShowLogin } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");

  const applyPromoCode = async () => {
    try {
        const response = await axios.post(`${url}/api/coupon/validate`, { code: promoCode });
        if(response.data.success) {
            setDiscount(response.data.discountPercentage);
            alert("Coupon Applied! You saved " + response.data.discountPercentage + "%");
        } else {
            alert(response.data.message);
            setDiscount(0);
        }
    } catch (error) {
        console.error(error);
        alert("Error applying coupon");
    }
  }

  const hasItems = Object.keys(cartItems).some(key => cartItems[key] > 0);

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <p>{Object.values(cartItems).reduce((a, b) => a + b, 0)} Items</p>
      </div>

      {!hasItems ? (
        <div className="empty-cart">
            <img src={assets.basket_icon} alt="Empty Cart" />
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button onClick={() => navigate('/')}>Start Shopping</button>
        </div>
      ) : (
        <div className="cart-container">
            <div className="cart-items-section">
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {food_list.map((item, index) => {
                            if (cartItems[item._id] > 0) {
                                return (
                                    <tr key={index}>
                                        <td className="cart-product-cell">
                                            <img src={item.image.startsWith("http") ? item.image : url+"/images/"+item.image} alt="" className="cart-product-img"/>
                                            <div className="cart-product-details">
                                                <p className="cart-product-name">{item.name}</p>
                                                <p className="cart-product-cat">{item.category}</p>
                                            </div>
                                        </td>
                                        <td>{item.price.toLocaleString()} ₫</td>
                                        <td className="cart-quantity-cell">{cartItems[item._id]}</td>
                                        <td className="cart-total-cell">{(item.price * cartItems[item._id]).toLocaleString()} ₫</td>
                                        <td>
                                            <div className="cart-delete-btn" onClick={() => deleteItemFromCart(item._id)}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>
            </div>

            <div className="cart-summary-section">
                <div className="cart-summary-card">
                    <h3>Order Summary</h3>
                    
                    <div className="promo-code-section">
                        <p>Have a promo code?</p>
                        <div className="promo-input-group">
                            <input 
                                type="text" 
                                placeholder="Enter code" 
                                value={promoCode} 
                                onChange={(e)=>setPromoCode(e.target.value)} 
                            />
                            <button onClick={applyPromoCode}>Apply</button>
                        </div>
                    </div>

                    <hr />

                    <div className="summary-details">
                        <div className="summary-row">
                            <p>Subtotal</p>
                            <p>{getTotalCartAmount().toLocaleString()} ₫</p>
                        </div>
                        <div className="summary-row">
                            <p>Delivery Fee</p>
                            <p>Calculated at checkout</p>
                        </div>
                        {discount > 0 && (
                            <div className="summary-row discount">
                                <p>Discount</p>
                                <p>-{discount}%</p>
                            </div>
                        )}
                        <hr className="total-divider"/>
                        <div className="summary-row total">
                            <p>Total</p>
                            <p>{getFinalAmount().toLocaleString()} ₫</p>
                        </div>
                    </div>

                    <button 
                        className="checkout-btn"
                        onClick={() => !token ? setShowLogin(true) : navigate("/order")}
                    >
                        PROCEED TO CHECKOUT
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
