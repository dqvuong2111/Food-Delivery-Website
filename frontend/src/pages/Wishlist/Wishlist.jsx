import React, { useContext } from 'react'
import './Wishlist.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
import EmptyState from '../../components/EmptyState/EmptyState'
import { assets } from '../../assets/assets'

const Wishlist = () => {

	const { food_list, wishlist } = useContext(StoreContext);

	return (
		<div className='wishlist'>
			<h2>My Wishlist</h2>
			<div className="wishlist-display-list">
				{food_list.map((item, index) => {
					if (wishlist[item._id]) {
						return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
					}
				})}
			</div>
			{Object.keys(wishlist).length === 0 && (
				<EmptyState
					image={assets.bag_icon}
					title="Your wishlist is empty"
					message="Looks like you haven't saved any items yet."
					btnText="Browse Menu"
					btnPath="/"
				/>
			)}
		</div>
	)
}

export default Wishlist