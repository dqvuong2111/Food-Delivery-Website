import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import "./NavbarSearch.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const { getTotalCartAmount, token, setToken, searchTerm, setSearchTerm, setShowLogin } = useContext(StoreContext);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const logout = ()=>{
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };


  // Auto update menu khi scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "footer", name: "contact-us" },
        { id: "app-download", name: "mobile-app" },
        { id: "explore-menu", name: "menu" },
      ];

      const scrollPosition = window.scrollY;

      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i].id);

        if (section && section.offsetTop <= scrollPosition + 150) {
          setMenu(sections[i].name);
          history.replaceState(null, "", `#${sections[i].id}`);
          return;
        }
      }

      if (scrollPosition < 200) {
        setMenu("home");
        history.replaceState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>

      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => {
            setMenu("home");
            window.scrollTo(0, 0);
          }}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>

        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>

        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </a>

        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact us
        </a>
      </ul>

      <div className="navbar-right">
        <div className={`navbar-search-container ${showSearch ? 'active' : ''}`}>
           {showSearch && (
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="navbar-search-input"
            />
           )}
           <img src={assets.search_icon} alt="" onClick={toggleSearch} className="navbar-search-icon-btn"/>
        </div>

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token?<button onClick={()=>setShowLogin(true)}>Sign in</button>
        :<div className="navbar-profile">
          <img src={assets.profile_icon} alt=""/>
          <ul className="nav-profile-dropdown">
            <li onClick={()=>navigate('/myorders')}> <img src={assets.bag_icon}/><p>Order</p></li>
            <hr />
            <li onClick={logout}> <img src={assets.logout_icon}/><p>Logout</p></li>
          </ul>
        </div>}

      </div>
    </div>
  );
};

export default Navbar;
