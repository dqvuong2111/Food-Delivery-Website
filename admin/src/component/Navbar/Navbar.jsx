import React from "react"
import "./Navbar.css"
import {assets} from "../../assets/assets"

const Narbar = () => {
  return (
    <div className="navbar">
        <img className="logo" src={assets.logo} alt=""/>
        <img className='profie' src={assets.profile_image} alt=""/>
        
    </div>
  )
}

export default Narbar
