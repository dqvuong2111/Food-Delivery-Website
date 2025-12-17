import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './AddToCart.css';

const AddToCart = ({ id }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const itemCount = cartItems[id] || 0;

  return (
    <div className={`add-to-cart ${itemCount > 0 ? 'active' : ''}`}>
      {!itemCount ? (
        <button className="add-btn-quick" onClick={() => addToCart(id)}>
          Add to Cart
        </button>
      ) : (
        <div className="counter-controls">
          <button onClick={() => removeFromCart(id)} className="counter-btn remove">
             <img src={assets.remove_icon_red} alt="-" />
          </button>
          <span>{itemCount}</span>
          <button onClick={() => addToCart(id)} className="counter-btn add">
            <img src={assets.add_icon_green} alt="+" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
