import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, List, ShoppingBag, Ticket, Image, Layers, Settings } from 'lucide-react'

const Sidebar = () => {
	return (
		<div className='sidebar'>
			<div className="sidebar-options">
				<NavLink to='/' className="sidebar-option">
					<LayoutDashboard size={20} />
					<p>Dashboard</p>
				</NavLink>
				<NavLink to='/add' className="sidebar-option">
					<PlusCircle size={20} />
					<p>Add Items</p>
				</NavLink>
				<NavLink to='/list' className="sidebar-option">
					<List size={20} />
					<p>List Items</p>
				</NavLink>
				<NavLink to='/orders' className="sidebar-option">
					<ShoppingBag size={20} />
					<p>Orders</p>
				</NavLink>
				<NavLink to='/coupons' className="sidebar-option">
					<Ticket size={20} />
					<p>Coupons</p>
				</NavLink>
				<NavLink to='/banners' className="sidebar-option">
					<Image size={20} />
					<p>Banners</p>
				</NavLink>
				<NavLink to='/category' className="sidebar-option">
					<Layers size={20} />
					<p>Categories</p>
				</NavLink>
				<NavLink to='/settings' className="sidebar-option">
					<Settings size={20} />
					<p>Settings</p>
				</NavLink>
			</div>
		</div>
	)
}

export default Sidebar

