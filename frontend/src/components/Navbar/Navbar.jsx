import React, { useState, useEffect } from 'react' // 👈 Cần import thêm useEffect
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const [menu, setMenu] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'footer', name: 'contact-us' },
        { id: 'app-download', name: 'mobile-app' },
        { id: 'explore-menu', name: 'menu' },
      ];
      
      const scrollPosition = window.scrollY;

      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i].id);
        
        if (section && section.offsetTop <= scrollPosition + 150) {
          
          setMenu(sections[i].name);
          
          history.replaceState(null, '', `#${sections[i].id}`); 
          
          return; 
        }
      }

      if (scrollPosition < 200) { 
        setMenu("home");
        history.replaceState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  
  return (
    <div className='navbar'>
      <img src={assets.logo} alt="" className="logo" />
      <ul className="navbar-menu">
        
        <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>home</Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu" ?"active":""}>menu</a>
        <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app" ?"active":""}>mobile-app</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us" ?"active":""}>contact us</a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <img src={assets.basket_icon} alt="" />
          <div className="dot"></div>
        </div>
        <button>sign in</button>
      </div>
    </div>
  )
}

export default Navbar