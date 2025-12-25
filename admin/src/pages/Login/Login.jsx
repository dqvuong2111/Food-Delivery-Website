import React, { useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({ url, setToken }) => {

  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(url + "/api/user/login", data)
      if (response.data.success) {
        if (response.data.role === "admin") {
          setToken(response.data.token)
          localStorage.setItem("token", response.data.token)
          toast.success("Welcome Admin")
        } else {
          toast.error("Access Denied: You are not an admin")
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
        console.error(error);
        toast.error("Login failed")
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Admin Panel</h2>
          <img src={assets.logo} alt="" />
        </div>
        <div className="login-popup-inputs">
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login