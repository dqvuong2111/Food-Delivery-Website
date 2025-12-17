import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, discount, setDiscount, getFinalAmount, token, setShowLogin } =
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

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Discount</p>
              <p>{discount}%</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getFinalAmount()}
              </b>
            </div>
          </div>
          <button onClick={() => !token ? setShowLogin(true) : navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code. Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" value={promoCode} onChange={(e)=>setPromoCode(e.target.value)} />
              <button onClick={applyPromoCode}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
