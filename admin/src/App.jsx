import React, { useState } from 'react';
import Navbar from './component/Navbar/Navbar';
import Sidebar from './component/Sidebar/Sidebar';
import { Routes, Route } from "react-router-dom";
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Coupons from './pages/Coupons/Coupons';
import Dashboard from './pages/Dashboard/Dashboard';
import Banners from './pages/Banners/Banners';
import Category from './pages/Category/Category';
import Settings from './pages/Settings/Settings';
import Login from './pages/Login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

	const url = "http://localhost:4000";
	const [token, setToken] = useState(localStorage.getItem("token") || "");

	return (
		<div>
			<ToastContainer />
			{token === "" ? (
				<Login url={url} setToken={setToken} />
			) : (
				<>
					<Navbar url={url} setToken={setToken} />
					<div className="app-content">
						<Sidebar />
						<Routes>
							<Route path="/" element={<Dashboard url={url} />} />
							<Route path="/add" element={<Add url={url} />} />
							<Route path="/list" element={<List url={url} />} />
							<Route path="/orders" element={<Orders url={url} />} />
							<Route path="/coupons" element={<Coupons url={url} />} />
							<Route path="/banners" element={<Banners url={url} />} />
							<Route path="/category" element={<Category url={url} />} />
							<Route path="/settings" element={<Settings url={url} />} />
						</Routes>
					</div>
				</>
			)}
		</div>
	);
}

export default App;