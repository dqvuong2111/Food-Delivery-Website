import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import FoodFilter from '../../components/FoodFilter/FoodFilter'
import StoreInfo from '../../components/StoreInfo/StoreInfo'
import Feedback from '../../components/Feedback/Feedback'

const Home = () => {

	const [category, setCategory] = useState("All");

	return (
		<div>
			<Header />
			<StoreInfo />
			<ExploreMenu category={category} setCategory={setCategory} />
			<FoodFilter />
			<FoodDisplay category={category} />
			<Feedback />
			<AppDownload />
		</div>
	)
}

export default Home
