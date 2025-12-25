import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import "./NavbarSearch.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { Search, ShoppingBasket, User, ShoppingBag, LogOut, Heart } from "lucide-react";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        scrollToSection("food-filter", "menu");
    }
  };

  const scrollToSection = (sectionId, menuName) => {
    setMenu(menuName);
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
           element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (window.location.pathname !== "/") return;

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
          return;
        }
      }

      if (scrollPosition < 200) {
        setMenu("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
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
          Home
        </Link>

        <a
          href="#explore-menu"
          onClick={(e) => { e.preventDefault(); scrollToSection("explore-menu", "menu"); }}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>

        <a
          href="#app-download"
          onClick={(e) => { e.preventDefault(); scrollToSection("app-download", "mobile-app"); }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>

        <a
          href="#footer"
          onClick={(e) => { e.preventDefault(); scrollToSection("footer", "contact-us"); }}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>

      <div className="navbar-right">
        <form onSubmit={handleSearch} className={`navbar-search-container ${showSearch ? 'active' : ''}`}>
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
           <Search size={26} color="#49557e" onClick={showSearch ? handleSearch : toggleSearch} className="navbar-search-icon-btn" style={{cursor: 'pointer'}} />
        </form>

        <div className="navbar-search-icon">
          <Link to="/cart">
            <ShoppingBasket size={26} color="#49557e" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token?<button onClick={()=>setShowLogin(true)}>Sign in</button>
        :<div className="navbar-profile">
          <User size={26} color="#49557e" />
          <ul className="nav-profile-dropdown">
            <li onClick={()=>navigate('/profile')}> <User size={20} /><p>Profile</p></li>
            <hr />
            <li onClick={()=>navigate('/wishlist')}> <Heart size={20} /><p>Wishlist</p></li>
            <hr />
            <li onClick={()=>navigate('/myorders')}> <ShoppingBag size={20} /><p>Order</p></li>
            <hr />
            <li onClick={logout}> <LogOut size={20} /><p>Logout</p></li>
          </ul>
        </div>}

      </div>
    </div>
  );
};

export default Navbar;