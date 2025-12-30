import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, discount, getFinalAmount, settings } =
    useContext(StoreContext);
  
  const [deliveryFee, setDeliveryFee] = useState(settings.deliveryFee);
  const [loadingFee, setLoadingFee] = useState(false);
  const [quotationId, setQuotationId] = useState("");

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Hàm tính phí giao hàng từ API
  const fetchDeliveryFee = async () => {
    if (data.street && data.city) {
      setLoadingFee(true);
      try {
        const pickupAddress = "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội"; // Địa chỉ HUST
        const response = await axios.post(url + "/api/delivery/estimate", {
          pickup: pickupAddress,
          dropoff: `${data.street}, ${data.city}`
        }, { headers: { token } });

        if (response.data.success) {
          // Lalamove V3 structure: response.data.data (quote) -> .data -> .priceBreakdown -> .total
          // Note: response.data is the axios body. response.data.data is what we sent from backend (quote).
          // quote (from Lalamove) has a 'data' property.
          
          const lalamoveData = response.data.data.data;
          const totalAmount = lalamoveData.priceBreakdown?.total || lalamoveData.totalAmount;
          
          const amount = parseFloat(totalAmount);
          
          if (!isNaN(amount)) {
             setDeliveryFee(amount);
          }
          setQuotationId(lalamoveData.quotationId);
        }
      } catch (error) {
        console.error("Error fetching delivery fee:", error);
      } finally {
        setLoadingFee(false);
      }
    }
  };

  // Tự động tính lại phí khi người dùng ngừng nhập địa chỉ (sau 2 giây)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDeliveryFee();
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [data.street, data.city]);

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    const totalCart = getTotalCartAmount();
    const currentDeliveryFee = Number(deliveryFee) || 0;
    const currentDiscount = Number(discount) || 0;
    
    // Calculate total safely
    let finalAmount = totalCart + currentDeliveryFee - (totalCart * currentDiscount / 100);
    
    // Ensure it's not NaN or negative
    if (isNaN(finalAmount) || finalAmount < 0) finalAmount = 0;

    let orderData = {
      address: data,
      items: orderItems,
      amount: finalAmount,
      deliveryFee: currentDeliveryFee,
      quotationId: quotationId,
      // Send full return URLs from client side to ensure correct port/domain
      success_url: `${window.location.origin}/verify?success=true&orderId=`, 
      cancel_url: `${window.location.origin}/verify?success=false&orderId=`,
    };

    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error placing order");
    }
  };
  
  
  const navigte = useNavigate()

  useEffect(() => {
    if(!token){
      navigte('/cart')
    }
    else if(getTotalCartAmount() === 0) {
      navigte('/cart')
    }
  }, [token])



  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        
        {/* Contact Information Section */}
        <div className="form-section">
          <h3 className="section-title">Contact Details</h3>
          <div className="multi-fields">
            <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
            <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
          </div>
          <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email Address" />
          <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone Number" />
        </div>

        {/* Address Information Section */}
        <div className="form-section">
          <h3 className="section-title">Delivery Address</h3>
          
          {/* Google Maps Search Box */}
          <div className="search-box-container">
             <input 
                id="search-input"
                type="text" 
                placeholder="Search your location..." 
                className="address-search-input"
             />
             <i className="search-icon">📍</i>
          </div>

          {/* Map Container */}
          <div id="map" className="map-container"></div>

          {/* Manual Address Fields (Can be auto-filled later) */}
          <div className="address-details">
            <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street Address" />
            <div className="multi-fields">
              <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
              <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
            </div>
            <div className="multi-fields">
              <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip Code" />
              <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
            </div>
          </div>
        </div>

      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount().toLocaleString()} ₫</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{loadingFee ? "Calculating..." : `${deliveryFee.toLocaleString()} ₫`}</p>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details discount">
                  <p>Discount</p>
                  <p>-{discount}%</p>
                </div>
              </>
            )}
            <hr className="total-divider" />
            <div className="cart-total-details total">
              <b>Total</b>
              <b>{getTotalCartAmount() === 0 ? 0 : (getTotalCartAmount() + deliveryFee - (getTotalCartAmount() * discount / 100)).toLocaleString()} ₫</b>
            </div>
          </div>
          <button type="submit" disabled={loadingFee} className="payment-btn">
            {loadingFee ? "WAITING FOR FEE..." : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
