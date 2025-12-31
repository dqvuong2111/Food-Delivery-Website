import React, { useContext, useEffect, useState, useRef } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet Default Icon Issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom Icons for Store and User
const storeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3514/3514491.png', // Shop Icon
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Location Pin Icon
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks
const LocationMarker = ({ setPosition, fetchAddress }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to update map bounds to fit both markers
const MapBoundsUpdater = ({ storePos, userPos }) => {
  const map = useMap();
  useEffect(() => {
    if (storePos && userPos) {
      const bounds = L.latLngBounds([storePos, userPos]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (userPos) {
      map.flyTo(userPos, 15);
    }
  }, [storePos, userPos, map]);
  return null;
};

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, discount, getFinalAmount, settings } =
    useContext(StoreContext);

  const [deliveryFee, setDeliveryFee] = useState(settings.deliveryFee);
  const [loadingFee, setLoadingFee] = useState(false);
  const [quotationId, setQuotationId] = useState("");

  // Coordinates
  const STORE_POS = { lat: 21.007383, lng: 105.842130 }; // Số 1 Đại Cồ Việt, HUST
  const [userPosition, setUserPosition] = useState({ lat: 21.0285, lng: 105.8542 }); // Default User Pos
  const [isMapInteracted, setIsMapInteracted] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "Hanoi", // Default city
    zipcode: "",
    country: "Vietnam",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Reverse Geocoding (Click on Map -> Get Address)
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      // Use OpenStreetMap Nominatim
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (response.data) {
        const address = response.data.address;
        setData(prev => ({
          ...prev,
          street: address.road || address.suburb || "",
          city: address.city || address.state || "Hanoi", // Map 'state' from OSM to 'city' field if needed, but UI has no state input
          country: "Vietnam", // Force Vietnam
          zipcode: address.postcode || ""
        }));
        setIsMapInteracted(true);
      }
    } catch (error) {
      console.error("Reverse Geocoding Error:", error);
    }
  }

  // Forward Geocoding (Type Address -> Move Map)
  const fetchCoordsFromAddress = async () => {
    if (!data.street) return;
    // Only fetch if user typed, not if map clicked (to avoid loop)
    if (isMapInteracted) {
      setIsMapInteracted(false);
      return;
    }

    try {
      const query = `${data.street}, ${data.city}, ${data.country}`;
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        setUserPosition({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
    }
  }

  // Debounce search when typing address
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoordsFromAddress();
    }, 1500);
    return () => clearTimeout(timer);
  }, [data.street, data.city]);


  // Hàm tính phí giao hàng từ API (Giữ nguyên logic cũ)
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
    if (!token) {
      navigte('/cart')
    }
    else if (getTotalCartAmount() === 0) {
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
              placeholder="Search your location (or click on map)"
              className="address-search-input"
              value={data.street} // Bind search box to street
              onChange={(e) => setData({ ...data, street: e.target.value })}
            />
            <i className="search-icon">📍</i>
          </div>

          {/* Map Container */}
          <div id="map" className="map-container">
            <MapContainer center={STORE_POS} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Store Marker */}
              <Marker position={STORE_POS} icon={storeIcon}>
                <Popup>
                  <b>Cửa hàng (Bách Khoa)</b><br />Số 1 Đại Cồ Việt
                </Popup>
              </Marker>

              {/* User Marker */}
              <Marker position={userPosition} icon={userIcon} draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    setUserPosition(position);
                    fetchAddressFromCoords(position.lat, position.lng);
                  },
                }}
              >
                <Popup>Vị trí nhận hàng</Popup>
              </Marker>

              {/* Route Line (Simple straight line for visual connection) */}
              <Polyline positions={[STORE_POS, userPosition]} color="tomato" weight={3} dashArray="5, 10" />

              <LocationMarker setPosition={setUserPosition} fetchAddress={fetchAddressFromCoords} />
              <MapBoundsUpdater storePos={STORE_POS} userPos={userPosition} />
            </MapContainer>
          </div>

          {/* Manual Address Fields (Can be auto-filled later) */}
          <div className="address-details">
            <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street Address" />
            <div className="multi-fields">
              <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
              <input required name="country" value={data.country} type="text" placeholder="Country" readOnly />
            </div>
            {/* Phone moved here for better layout, or kept above? Keeping zip for now but could hide if needed */}
            <div className="multi-fields">
              <input name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip Code (Optional)" />
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
