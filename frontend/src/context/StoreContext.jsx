import { createContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [category_list, setCategoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState(0); // Percentage
  const [couponCode, setCouponCode] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minRating, setMinRating] = useState(0);
  const [settings, setSettings] = useState({
    deliveryFee: 2, // Fallback default
    taxRate: 0,
    estimatedDeliveryTime: "30-45 min",
    isStoreOpen: true
  });

  const fetchSettings = async () => {
    try {
      const response = await axios.get(url + "/api/settings/get");
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const addToWishlist = async (itemId) => {
    setWishlist((prev) => ({ ...prev, [itemId]: true }));
    if (token) {
      await axios.post(url + "/api/user/add-wishlist", { itemId }, { headers: { token } });
    }
  }

  const removeFromWishlist = async (itemId) => {
    setWishlist((prev) => {
      const newWishlist = { ...prev };
      delete newWishlist[itemId];
      return newWishlist;
    });
    if (token) {
      await axios.post(url + "/api/user/remove-wishlist", { itemId }, { headers: { token } });
    }
  }

  const loadWishlist = async (token) => {
    const response = await axios.get(url + "/api/user/get-wishlist", { headers: { token } });
    if (response.data.success) {
      setWishlist(response.data.wishlist);
    }
  }

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const deleteItemFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      delete newCart[itemId];
      return newCart;
    });
    if (token) {
      await axios.post(url + "/api/cart/delete", { itemId }, { headers: { token } });
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // Get cart total without delivery fee (for cart page)
  const getCartTotal = () => {
    const total = getTotalCartAmount();
    if (total === 0) return 0;
    const discountAmount = (total * discount) / 100;
    return total - discountAmount;
  };

  // Get final amount with delivery fee (for checkout page)
  const getFinalAmount = (deliveryFee = 0) => {
    const total = getTotalCartAmount();
    if (total === 0) return 0;
    const currentDeliveryFee = deliveryFee || settings.deliveryFee || 0;
    const taxAmount = (total * settings.taxRate) / 100;
    const discountAmount = (total * discount) / 100;
    return total + currentDeliveryFee + taxAmount - discountAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(url + "/api/category/list");
      if (response.data.success) {
        setCategoryList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const loadCartData = async (token) => {
    const respone = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(respone.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await fetchCategoryList();
      await fetchSettings();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
        await loadWishlist(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    category_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    searchTerm,
    setSearchTerm,
    discount,
    setDiscount,
    getFinalAmount,
    getCartTotal,
    couponCode,
    setCouponCode,
    showLogin,
    setShowLogin,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    minRating, setMinRating,
    deleteItemFromCart,
    settings
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
