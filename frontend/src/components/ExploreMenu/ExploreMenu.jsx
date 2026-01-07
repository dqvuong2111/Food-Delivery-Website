import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../context/StoreContext'
import { menu_list } from '../../assets/assets' // Fallback static list

const ExploreMenu = ({ category, setCategory }) => {
	const { category_list, url } = useContext(StoreContext);

	// Use database categories if available, otherwise fallback to static menu_list
	const displayCategories = category_list && category_list.length > 0
		? category_list.map(cat => ({
			menu_name: cat.name,
			menu_image: cat.image.startsWith('http') ? cat.image : `${url}/images/${cat.image}`
		}))
		: menu_list;

	return (
		<div className='explore-menu' id='explore-menu'>
			<h1>Explore our menu</h1>
			<p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
			<div className="explore-menu-list">
				{displayCategories.map((item, index) => {
					return (
						<div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} key={index} className='explore-menu-list-item' data-aos="zoom-in" data-aos-delay={index * 100}>
							<img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt="" />
							<p>{item.menu_name}</p>
						</div>
					)
				})}
			</div>
			<hr />
		</div>
	)
}

export default ExploreMenu
